import os
HERE=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import json, sys
from datetime import datetime
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

TEAL="#12707F"; ORANGE="#E8871E"; DARK="#0A3A45"; GRAY="#5B6B70"; RED="#C0392B"
OUT=os.path.join(HERE,"demo","report"); os.makedirs(OUT,exist_ok=True)

def parse(path):
    """Return per-second buckets: t-> list durations, failedcount, reqcount, vus."""
    dur={}   # sec -> [durations]
    fail={}  # sec -> [0/1]
    vus={}   # sec -> last vus value
    t0=None
    with open(path) as f:
        for line in f:
            if '"Point"' not in line: continue
            try: o=json.loads(line)
            except: continue
            if o.get("type")!="Point": continue
            m=o.get("metric"); d=o.get("data",{})
            ts=d.get("time");
            if not ts: continue
            # parse RFC3339; trim nanoseconds to microseconds
            try:
                tt=datetime.fromisoformat(ts.replace("Z","+00:00"))
            except:
                continue
            if t0 is None: t0=tt
            sec=int((tt-t0).total_seconds())
            v=d.get("value",0)
            if m=="http_req_duration":
                dur.setdefault(sec,[]).append(v)
            elif m=="http_req_failed":
                fail.setdefault(sec,[]).append(v)
            elif m=="vus":
                vus[sec]=v
    return dur,fail,vus,t0

def series(dur,fail,vus):
    secs=sorted(set(list(dur)+list(fail)+list(vus)))
    if not secs: return [],[],[],[],[]
    smax=max(secs)
    xs=list(range(0,smax+1))
    p95=[]; thr=[]; err=[]; vu=[]
    lastv=0
    for s in xs:
        ds=dur.get(s,[])
        p95.append(np.percentile(ds,95) if ds else np.nan)
        thr.append(len(ds))                      # requests completed that second
        fs=fail.get(s,[])
        err.append(100.0*sum(fs)/len(fs) if fs else 0.0)
        if s in vus: lastv=vus[s]
        vu.append(lastv)
    return xs,p95,thr,err,vu

def style(ax):
    ax.spines['top'].set_visible(False); ax.spines['right'].set_visible(False)
    ax.grid(True,axis='y',ls=':',alpha=.4)

# ---------- LOAD ----------
dur,fail,vus,_=parse(os.path.join(HERE,"demo","out","load.json"))
xs,p95,thr,err,vu=series(dur,fail,vus)
fig,ax=plt.subplots(figsize=(8,3.2),dpi=130)
ax.plot(xs,p95,color=TEAL,lw=2,label="p95 latency (ms)")
ax.axhline(800,color=ORANGE,ls='--',lw=1.3,label="SLO p95 = 800 ms")
ax.set_ylabel("p95 latency (ms)",color=TEAL); ax.set_xlabel("time (s)")
ax.set_ylim(0,1000); style(ax)
ax2=ax.twinx(); ax2.plot(xs,vu,color=GRAY,lw=1.2,alpha=.7,label="VUs")
ax2.set_ylabel("VUs",color=GRAY); ax2.spines['top'].set_visible(False)
ax.set_title("DEMO 1 — LOAD: p95 stays under the 800 ms SLO (PASS)",color=DARK,fontweight='bold',fontsize=11)
l1,la1=ax.get_legend_handles_labels(); l2,la2=ax2.get_legend_handles_labels()
ax.legend(l1+l2,la1+la2,loc='upper left',fontsize=8,framealpha=.9)
plt.tight_layout(); plt.savefig(f"{OUT}/load.png"); plt.close()

# ---------- BREAKPOINT ----------
dur,fail,vus,_=parse(os.path.join(HERE,"demo","out","breakpoint.json"))
xs,p95,thr,err,vu=series(dur,fail,vus)
fig,ax=plt.subplots(figsize=(8,3.2),dpi=130)
ax.plot(xs,p95,color=TEAL,lw=2,label="p95 latency (ms)")
ax.set_ylabel("p95 latency (ms)",color=TEAL); ax.set_xlabel("time (s)")
style(ax)
ax2=ax.twinx()
ax2.plot(xs,thr,color=DARK,lw=1.4,alpha=.6,label="throughput (req/s)")
ax2.plot(xs,err,color=RED,lw=2,ls='-',label="error % (503)")
ax2.set_ylabel("throughput (req/s)  ·  error %",color=DARK)
ax2.spines['top'].set_visible(False)
# mark the knee = first sec error% > 5
knee=next((s for s,e in zip(xs,err) if e>5),None)
if knee is not None:
    ax.axvline(knee,color=ORANGE,ls='--',lw=1.3)
    ax.annotate("the knee",xy=(knee,ax.get_ylim()[1]*0.7),xytext=(knee+3,ax.get_ylim()[1]*0.8),
        color=ORANGE,fontsize=9,fontweight='bold')
ax.set_title("DEMO 2 — BREAKING POINT: latency spikes, 503s climb, throughput plateaus",color=DARK,fontweight='bold',fontsize=10.5)
l1,la1=ax.get_legend_handles_labels(); l2,la2=ax2.get_legend_handles_labels()
ax.legend(l1+l2,la1+la2,loc='upper left',fontsize=8,framealpha=.9)
plt.tight_layout(); plt.savefig(f"{OUT}/breakpoint.png"); plt.close()

# ---------- SPIKE + recovery ----------
dur,fail,vus,_=parse(os.path.join(HERE,"demo","out","spike.json"))
xs,p95,thr,err,vu=series(dur,fail,vus)
# baseline = median p95 over first 15s; recovery when p95 back <= 1.5x baseline after the drop
base=np.nanmedian([p for s,p in zip(xs,p95) if s<15 and not np.isnan(p)])
peak_s=int(np.nanargmax([ -1 if np.isnan(p) else p for p in p95]))
# drop happens at 20+5+30+5 = 60s in this profile; find recovery after t=60
drop_t=60
thr_line=base*1.5
rec=None
for s,p in zip(xs,p95):
    if s>=drop_t and not np.isnan(p) and p<=thr_line:
        rec=s; break
recovery=(rec-drop_t) if rec is not None else None
fig,ax=plt.subplots(figsize=(8,3.2),dpi=130)
ax.plot(xs,p95,color=TEAL,lw=2,label="p95 latency (ms)")
ax.axhline(base,color=GRAY,ls=':',lw=1.2,label=f"baseline ~{base:.0f} ms")
ax.set_ylabel("p95 latency (ms)",color=TEAL); ax.set_xlabel("time (s)")
style(ax)
ax2=ax.twinx(); ax2.plot(xs,vu,color=ORANGE,lw=1.3,alpha=.75,label="VUs")
ax2.set_ylabel("VUs",color=ORANGE); ax2.spines['top'].set_visible(False)
ax.axvline(20,color=ORANGE,ls='--',lw=1,alpha=.6)
ax.annotate("SPIKE",xy=(22,ax.get_ylim()[1]*0.85),color=ORANGE,fontsize=9,fontweight='bold')
if rec is not None:
    ax.axvspan(drop_t,rec,color=TEAL,alpha=.10)
    ax.annotate(f"recovery ≈ {recovery}s",xy=(rec,base),xytext=(rec+1,base+150),
        color=TEAL,fontsize=9,fontweight='bold',
        arrowprops=dict(arrowstyle='->',color=TEAL))
ax.set_title("DEMO 3 — SPIKE: latency jumps under the surge, then recovers",color=DARK,fontweight='bold',fontsize=10.5)
l1,la1=ax.get_legend_handles_labels(); l2,la2=ax2.get_legend_handles_labels()
ax.legend(l1+l2,la1+la2,loc='upper right',fontsize=8,framealpha=.9)
plt.tight_layout(); plt.savefig(f"{OUT}/spike.png"); plt.close()

print("baseline_ms=%.0f peak_p95=%.0f recovery_s=%s"%(base, np.nanmax(p95), recovery))
print("DONE")
