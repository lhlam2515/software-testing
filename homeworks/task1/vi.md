# Danh sách kiểm tra GUI dùng chung — Nhóm 02 (HW03, Task 1A)

**Chủ sở hữu (tác giả của danh sách kiểm tra này):** Lê Hoàng Lâm (23127216)
**Dùng bởi:** tất cả thành viên Nhóm 02, trên màn hình kịch bản của riêng mình (Task 1B)
**SUT:** EMS — <https://prod-dev.ems-fitus.cloud/>

---

## Quy tắc

- **Mục tiêu: > 40 mục**, bao phủ cả bốn khía cạnh giao diện (IA-01 … IA-04).
- Mỗi mục phải **có thể kiểm chứng trên một màn hình**, với một trong ba kết luận:
  - **Passed** — mục áp dụng cho màn hình này và màn hình thỏa mãn mục đó.
  - **Failed** — mục áp dụng và màn hình vi phạm mục đó.
  - **N/A** — lớp điều khiển mà mục được viết cho không tồn tại trên màn hình này (không có danh sách dữ liệu, không có tải tệp, không có điều khiển tab, …). `N/A` không phải là một dạng đỗ mềm: nghĩa là mục đó chưa bao giờ được kiểm tra, và nó bị loại khỏi mẫu số tính tỷ lệ đỗ.
- **Ghi chú là bắt buộc cho mọi dòng `Failed` và mọi dòng `N/A`.** Với `Failed`, nêu rõ lỗi cụ thể. Với `N/A`, nêu tên lớp điều khiển bị thiếu. Chỉ lặp lại nội dung của mục không được tính là Ghi chú.
- Ảnh chụp màn hình chỉ đính kèm cho các dòng **`Failed`**.
- Mỗi mục phải trích dẫn **nguồn** của nó: một heuristic của Nielsen, một nguyên tắc của Norman, một quy tắc vàng của Shneiderman, một slide của môn học, một tiêu chuẩn (ví dụ WCAG), hoặc một quan sát riêng của EMS.
- Cột **Origin** cho biết mục đến từ bản nháp AI (`AI`) hay được con người thêm vào sau khi xem xét (`Human`). Mỗi mục `Human` cần có lời giải thích tương ứng trong [ai-gap-notes.md](ai-gap-notes.md).

**Quy ước ID của mục:** `IA-01-01`, `IA-01-02`, … theo từng khía cạnh.

---

## Tóm tắt phạm vi

| Khía cạnh giao diện | Mục | Do AI tạo | Do người thêm |
| ------------------- | --- | --------- | ------------- |
| IA-01 — Chuẩn UI chung | 17 | 13 | 4 |
| IA-02 — Biểu mẫu | 21 | 14 | 7 |
| IA-03 — Điều hướng | 13 | 13 | 0 |
| IA-04 — Phản hồi / trạng thái | 10 | 10 | 0 |
| **Tổng** (mục tiêu > 40) | 61 | 50 | 11 |

---

## IA-01 — Chuẩn UI chung

*Bố cục, căn chỉnh, kiểu chữ, màu sắc, tính nhất quán, i18n EN/VI, trạng thái trống và đang tải.*

| ID | Mục kiểm tra | Heuristic / Nguồn | Origin (AI / Human) | Ghi chú |
| -- | ------------ | ----------------- | -------------------- | ------- |
| IA-01-01 | Trên danh sách dữ liệu có bộ lọc và cột có thể sắp xếp, tiêu đề cột, nhãn bộ lọc và nhãn nút thao tác dùng thuật ngữ nhất quán giữa các màn hình (không dùng từ đồng nghĩa cho cùng một hành động, ví dụ "Delete" và "Remove"). | Nielsen #4 — Consistency and standards | AI | |
| IA-01-02 | Trên bất kỳ màn hình nào, nút chính và nút phụ tuân theo một hệ thống phân cấp trực quan nhất quán duy nhất (độ đậm chữ, màu sắc, kích thước) trên toàn ứng dụng thay vì mỗi màn hình một kiểu. | Shneiderman #1 — Strive for consistency | AI | |
| IA-01-03 | Trên biểu mẫu nhiều trường, nhãn trường dùng một kiểu căn chỉnh nhất quán (tất cả đều căn trái hoặc căn trên) trong cùng biểu mẫu, không trộn lẫn tùy tiện giữa các trường cùng cấp. | S13 Checklist (Layout and alignment) | AI | |
| IA-01-04 | Trên danh sách dữ liệu có bộ lọc và cột có thể sắp xếp, khi lọc/tìm kiếm không có kết quả thì hiển thị thông báo trạng thái trống riêng thay vì để thân bảng trống rỗng. | EMS-specific | AI | |
| IA-01-05 | Trên danh sách dữ liệu hoặc trang chi tiết đang thực hiện tải dữ liệu không đồng bộ, phải có chỉ báo đang tải (skeleton hoặc spinner) trong lúc chờ, thay vì để màn hình trống hoặc đứng yên. | Nielsen #1 — Visibility of system status | AI | |
| IA-01-06 | Trên bất kỳ màn hình nào, văn bản nội dung và văn bản nhãn trường phải đạt tỷ lệ tương phản tối thiểu 4.5:1 so với nền. | WCAG 2.2 AA — SC 1.4.3 Contrast (Minimum) | AI | |
| IA-01-07 | Trên bất kỳ màn hình nào, các thành phần UI không phải văn bản (biểu tượng, viền ô nhập, viền nút) phải đạt tỷ lệ tương phản tối thiểu 3:1 so với nền liền kề. | WCAG 2.2 AA — SC 1.4.11 Non-text Contrast | AI | |
| IA-01-08 | Trên bất kỳ màn hình nào, biểu tượng được dùng mà không có văn bản hiển thị đi kèm (ví dụ biểu tượng trạng thái hoặc biểu tượng hành động) phải có tên truy cập được (alt text hoặc aria-label) diễn tả ý nghĩa của nó. | WCAG 2.2 AA — SC 1.1.1 Non-text Content | AI | |
| IA-01-09 | Trên bất kỳ màn hình nào, phần tử tương tác đang được focus (nút, liên kết, ô nhập) phải có chỉ báo focus hiển thị rõ ràng khác với trạng thái khi không focus. | WCAG 2.2 AA — SC 2.4.7 Focus Visible | AI | |
| IA-01-10 | Trên bất kỳ màn hình nào, kiểu chữ (họ font, cỡ chữ cơ sở, thang tiêu đề) phải nhất quán giữa các màn hình, không có việc thay font tùy ý trên một số màn hình. | S13 Checklist (Typography) | AI | |
| IA-01-11 | Trên huy hiệu trạng thái / trạng thái được mã hóa bằng màu, bảng màu phải nhất quán trong toàn ứng dụng — cùng một màu không được dùng để chỉ hai trạng thái khác nhau ở các ngữ cảnh khác nhau. | S13 Checklist (Color scheme) | AI | |
| IA-01-12 | Trên bất kỳ màn hình nào, các phần tử tương tác (liên kết, nút, biểu tượng có thể bấm) phải dễ phân biệt với văn bản tĩnh hoặc phần tử trang trí chỉ bằng nhìn lướt qua, không cần rê chuột mới thấy. | Norman — Signifiers | AI | |
| IA-01-13 | Trên danh sách dữ liệu có bộ lọc và cột có thể sắp xếp, các cột số và ngày tháng phải dùng một kiểu căn chỉnh nhất quán (ví dụ căn phải) trong toàn cột, không trộn trái/phải theo từng dòng. | S13 Checklist (Layout and alignment) | AI | |
| IA-01-14 | Sau khi chuyển ngôn ngữ giao diện, mọi chuỗi trên lớp giao diện của màn hình (mục nav, tên nút chỉ có biểu tượng, tooltip, thông báo xác thực) phải hiển thị bằng ngôn ngữ đã chọn, không còn chuỗi nào bị sót ở ngôn ngữ khác. | S13 Challenges (Localization and Internationalization) | Human | |
| IA-01-15 | Việc chuyển ngôn ngữ giao diện phải giữ người dùng ở đúng màn hình hiện tại và bảo toàn trạng thái xem hiện tại (bộ lọc đang dùng, tab đang mở, vị trí cuộn) thay vì đưa về màn hình mặc định. | Nielsen #3 — User control and freedom | Human | |
| IA-01-16 | Ngày, giờ và số phải được định dạng theo locale đã chọn, và mọi thời điểm sự kiện hiển thị phải có nhãn múi giờ rõ ràng. | S13 Challenges (Localization); Nielsen #2 | Human | |
| IA-01-17 | Chuỗi tiếng Việt phải hiển thị đầy đủ dấu, không có lỗi fallback font và không bị cắt ngắn do dài hơn chuỗi tiếng Anh tương ứng. | S13 GUI Testing Necessary (text overflow, missing components) | Human | |

---

## IA-02 — Biểu mẫu

*Nhãn, xác thực, vị trí lỗi, xử lý trường bắt buộc, tải tệp, trình soạn thảo rich-text.*

| ID | Mục kiểm tra | Heuristic / Nguồn | Origin (AI / Human) | Ghi chú |
| -- | ------------ | ----------------- | -------------------- | ------- |
| IA-02-01 | Trên biểu mẫu nhiều trường, mọi trường bắt buộc phải có chỉ báo hiển thị rõ ràng (ví dụ dấu sao đỏ) cạnh nhãn của nó. | Per-Control — Text Box (red asterisk on mandatory fields) | AI | |
| IA-02-02 | Trên biểu mẫu nhiều trường, khi gửi mà còn để trống trường bắt buộc thì việc gửi bị chặn và có thông báo lỗi hiển thị gần trường đó. | ISTQB Checklist (item 3) | AI | |
| IA-02-03 | Trên biểu mẫu nhiều trường, lỗi xác thực làm focus bàn phím quay về trường gây lỗi và trường đó được tô nổi bật trực quan. | Per-Control — Input-field validation | AI | |
| IA-02-04 | Trên biểu mẫu nhiều trường có tải ảnh/tệp, nếu tải một tệp vi phạm giới hạn kích thước hoặc kiểu tệp đã nêu thì phải hiện thông báo lỗi nêu rõ ràng giới hạn nào bị vi phạm, không chỉ báo lỗi chung chung. | S13 Bugs (data validation gaps) | AI | |
| IA-02-05 | Trên ô nhập văn bản, chuỗi chỉ gồm khoảng trắng phải bị từ chối như khi ô bị bỏ trống, không được chấp nhận như nội dung hợp lệ. | Per-Control — Text Box (rejects spaces-only input) | AI | |
| IA-02-06 | Trên ô nhập văn bản có giới hạn ký tự đã nêu, việc gõ vượt giới hạn phải bị chặn hoặc cắt tại ngưỡng đó một cách hiển thị được, thay vì âm thầm chấp nhận vượt quá. | Per-Control — Input-field validation (character limit) | AI | |
| IA-02-07 | Trên ô nhập ngày, tổ hợp ngày/tháng không hợp lệ (ví dụ 30 tháng 2) phải bị từ chối bằng lỗi hiển thị, thay vì âm thầm chấp nhận hoặc tự sửa. | Per-Control — Hyperlink/Image/Grid/List/Date (date field rejects invalid combinations) | AI | |
| IA-02-08 | Trên biểu mẫu nhiều trường có ô rich-text hoặc long-text, trạng thái ban đầu khi vừa tải vào không được chứa placeholder hoặc văn bản mẫu sót lại có thể bị nhầm là nội dung thật. | S13 Bugs (incorrect field defaults) | AI | |
| IA-02-09 | Trên biểu mẫu nhiều trường chỉ có một trường văn bản chính, khi focus đang ở trường đó thì nhấn Enter sẽ gửi biểu mẫu. | ISTQB Checklist (Enter-to-submit where appropriate) | AI | |
| IA-02-10 | Trên biểu mẫu nhiều trường, nút gửi phải hiển thị trạng thái bị vô hiệu hóa hoặc đang bận ngay sau lần bấm đầu tiên, ngăn việc bấm gửi lần hai một cách rõ ràng. | ISTQB Checklist (double-submit does not create duplicate records) | AI | |
| IA-02-11 | Trên biểu mẫu nhiều trường, hành động Reset hoặc Cancel nếu có phải xóa toàn bộ dữ liệu đã nhập về giá trị mặc định ban đầu. | ISTQB Checklist (Reset/Cancel clears all input) | AI | |
| IA-02-12 | Trên biểu mẫu nhiều trường, mỗi trường bị lỗi xác thực phải hiển thị thông báo lỗi dạng văn bản gắn với chính trường đó, không chỉ đổi màu viền. | WCAG 2.2 AA — SC 3.3.1 Error Identification | AI | |
| IA-02-13 | Trên biểu mẫu nhiều trường, mọi trường phải có nhãn hoặc hướng dẫn hiển thị trước khi người dùng cần nhập giá trị vào đó. | WCAG 2.2 AA — SC 3.3.2 Labels or Instructions | AI | |
| IA-02-14 | Trên biểu mẫu nhiều trường, khi có quy tắc xác thực đã biết trước (ví dụ định dạng bắt buộc hoặc khoảng số), thông báo lỗi phải chỉ cách sửa, không chỉ nói rằng dữ liệu không hợp lệ. | WCAG 2.2 AA — SC 3.3.3 Error Suggestion | AI | |
| IA-02-15 | Trên một điều khiển dropdown hoặc select, điều khiển phải có nhãn hiển thị, danh sách lựa chọn không được rỗng, thứ tự lựa chọn phải nhất quán, và mọi tùy chọn mặc định hoặc trống phải nằm ở vị trí cố định trong danh sách. | Per-Control — Dropdown / Combo Box | Human | |
| IA-02-16 | Trên nhóm checkbox hoặc radio, lựa chọn mặc định phải đúng, bấm vào nhãn phải bật/tắt điều khiển, Space phải bật/tắt khi đang focus, và một nhóm radio chỉ cho phép chọn đúng một mục. | Per-Control — Checkbox & Radio button | Human | |
| IA-02-17 | Một điều khiển ở trạng thái disabled phải được phân biệt rõ về mặt trực quan (mờ đi), không hiện con trỏ nhập văn bản, không nhận focus bàn phím, và lý do bị vô hiệu phải có thể tìm thấy trên màn hình. | ISTQB Checklist (item 7 — disabled state shown clearly); Per-Control — Text Box | Human | |
| IA-02-18 | Một giá trị quá dài trong một trường hoặc một nhãn không được làm vỡ bố cục của khối chứa nó (không chồng lấn, không bị cắt, không ép xuất hiện cuộn ngang). | ISTQB Checklist (item 9 — long field text does not break layout) | Human | |
| IA-02-19 | Trong một biểu mẫu, cơ chế kích hoạt xác thực phải nhất quán giữa các trường — либо tất cả xác thực khi blur, hoặc tất cả xác thực khi submit, không được pha trộn. | ISTQB Checklist (item 10 — real-time vs on-submit validation consistency) | Human | |
| IA-02-20 | Nội dung được soạn trong trình rich-text phải hiển thị ở màn hình đọc lại đúng như đã soạn (giữ nguyên heading, danh sách, liên kết), không lộ thẻ HTML thô. | S13 Bugs (data validation); assignment IA-02 (rich-text editor) | Human | |
| IA-02-21 | Ảnh thumbnail hoặc banner được tải lên phải hiển thị đúng tỷ lệ khung hình đã định mà không bị méo, không có placeholder ảnh lỗi, và phải có ảnh dự phòng khi nguồn ảnh bị thiếu. | Per-Control — Hyperlink/Image/Grid/List/Date (Image) | Human | |

---

## IA-03 — Điều hướng

*Menu, breadcrumb, tab, sidebar, sắp xếp lại bằng kéo-thả, quay lại/return, deep link.*

| ID | Mục kiểm tra | Heuristic / Nguồn | Origin (AI / Human) | Ghi chú |
| -- | ------------ | ----------------- | -------------------- | ------- |
| IA-03-01 | Trên menu điều hướng chính, mọi mục cấp cao nhất có thể đi tới từ đó phải mở đúng màn hình tương ứng, không có liên kết chết hay trang lỗi. | S13 Navigation (main menu navigation) | AI | |
| IA-03-02 | Trên màn hình được truy cập qua ít nhất một cấp điều hướng, breadcrumb phải phản ánh chính xác đường đi hiện tại, và mỗi phần trước đó phải bấm được để quay về đó. | S13 Navigation (breadcrumb navigation) | AI | |
| IA-03-03 | Trên các tab chia danh sách thành các trạng thái có tên, tại một thời điểm chỉ có đúng một tab được đánh dấu active/selected, và trạng thái trực quan của nó phải khác hẳn các tab không hoạt động. | Norman — Signifiers | AI | |
| IA-03-04 | Trên biểu mẫu nhiều trường, thứ tự tab bằng bàn phím phải đi qua các trường theo cùng thứ tự logic như bố cục trực quan (từ trên xuống dưới, từ trái sang phải). | S13 Navigation (form navigation, logical field order) | AI | |
| IA-03-05 | Trên trang chi tiết/xem trước được mở từ danh sách dữ liệu, hành động quay lại phải trả người dùng về đúng danh sách đó với bộ lọc trước đó và vị trí cuộn được giữ nguyên. | Nielsen #3 — User control and freedom | AI | |
| IA-03-06 | Trên danh sách dữ liệu hỗ trợ sắp xếp lại thứ tự (ví dụ kéo-thả), phần tử đang kéo phải có chỉ báo vị trí thả rõ ràng trong lúc kéo, và danh sách phải phản ánh thứ tự mới ngay sau khi thả. | EMS-specific | AI | [VERIFY] control class may not exist on every member's chosen screen |
| IA-03-07 | Trên bất kỳ màn hình nào, mọi phần tử tương tác (nút, liên kết, điều khiển biểu mẫu) phải có thể truy cập và thao tác chỉ bằng bàn phím (Tab / Shift+Tab / Enter / Space), không cần chuột. | WCAG 2.2 AA — SC 2.1.1 Keyboard | AI | |
| IA-03-08 | Trên bất kỳ modal hoặc hộp thoại nào, focus bàn phím không được bị nhốt bên trong nó — người dùng phải có thể thoát ra bằng phím chuẩn (ví dụ Tab có thể thoát vòng, hoặc Esc). | WCAG 2.2 AA — SC 2.1.2 No Keyboard Trap | AI | |
| IA-03-09 | Trên bất kỳ màn hình nào, thứ tự focus khi tab qua các phần tử tương tác phải theo một trình tự hợp lý khớp với thứ tự đọc trực quan. | WCAG 2.2 AA — SC 2.4.3 Focus Order | AI | |
| IA-03-10 | Trên danh sách dữ liệu hoặc trang chi tiết, văn bản hiển thị của liên kết (hoặc tên truy cập được) phải mô tả đích đến hay mục đích của nó mà không chỉ dựa vào ngữ cảnh xung quanh (ví dụ không chỉ là "click here"). | WCAG 2.2 AA — SC 2.4.4 Link Purpose (In Context) | AI | |
| IA-03-11 | Trên các màn hình khác nhau của ứng dụng, menu điều hướng chính phải xuất hiện ở cùng vị trí tương đối và cùng thứ tự mục, để người dùng quay lại không phải học lại bố cục. | WCAG 2.2 AA — SC 3.2.3 Consistent Navigation | AI | |
| IA-03-12 | Trên trang chi tiết có thể vào bằng deep link/share link, khi tải trực tiếp liên kết đó (không qua điều hướng trong app) phải hiển thị cùng nội dung như khi đi vào bằng UI. | EMS-specific | AI | |
| IA-03-13 | Trên hộp thoại xác nhận cho hành động phá hủy hoặc không thể hoàn tác, phải có nút Cancel hoặc đóng rõ ràng để rút lui mà không thực hiện hành động. | Shneiderman #6 — Permit easy reversal of actions | AI | |

---

## IA-04 — Phản hồi / trạng thái

*Toast, badge, hộp thoại xác nhận, thanh tiến trình, màu trạng thái, cập nhật theo thời gian thực.*

| ID | Mục kiểm tra | Heuristic / Nguồn | Origin (AI / Human) | Ghi chú |
| -- | ------------ | ----------------- | -------------------- | ------- |
| IA-04-01 | Trên một hành động không đồng bộ (ví dụ upload, export, submit), phải có toast hoặc thông báo inline xác nhận thành công hoặc thất bại khi hành động hoàn tất. | Shneiderman #3 — Offer informative feedback | AI | |
| IA-04-02 | Trên một hành động không đồng bộ kéo dài hơn tức thì (ví dụ upload, export, check-in scan), phải có chỉ báo tiến trình trong suốt thời gian thực hiện, không chỉ lúc bắt đầu và kết thúc. | Nielsen #1 — Visibility of system status | AI | |
| IA-04-03 | Trên huy hiệu trạng thái / trạng thái được mã hóa bằng màu, trạng thái phải được thể hiện bằng cả màu lẫn nhãn văn bản hoặc biểu tượng, không chỉ bằng màu đơn thuần. | WCAG 2.2 AA — SC 1.4.1 Use of Color | AI | |
| IA-04-04 | Trên trang chi tiết/xem trước có nút hành động chính phụ thuộc trạng thái, nếu trạng thái nền thay đổi (ví dụ do một thao tác khác trên cùng trang), trạng thái enable hoặc nhãn của nút phải cập nhật theo mà không cần tải lại trang thủ công. | S13 Bugs (control state alignment with data state) | AI | |
| IA-04-05 | Trên hộp thoại xác nhận cho hành động phá hủy hoặc không thể hoàn tác, hộp thoại phải nói rõ hành động nào sẽ xảy ra và yêu cầu bấm xác nhận tường minh trước khi tiếp tục. | Shneiderman #4 — Design dialogs to yield closure | AI | |
| IA-04-06 | Trên lỗi xác thực dữ liệu, thông báo phải viết bằng ngôn ngữ dễ hiểu, mô tả điều gì sai, không phải mã lỗi thô hay stack trace. | Nielsen #9 — Help users recognize, diagnose, and recover from errors | AI | |
| IA-04-07 | Trên bất kỳ màn hình nào khi một hành động tự đổi focus (ví dụ sau lỗi xác thực hoặc khi mở hộp thoại), focus phải rơi vào phần tử mà người dùng cần thao tác tiếp theo. | S13 Bugs (focus not placed on the object that needs it) | AI | |
| IA-04-08 | Trên một điều khiển tương tác tự tạo không phải phần tử HTML gốc (ví dụ dropdown tùy chỉnh, toggle tùy chỉnh, hoặc badge trạng thái), điều khiển phải hiển thị được tên và vai trò truy cập cho công nghệ hỗ trợ. | WCAG 2.2 AA — SC 4.1.2 Name, Role, Value | AI | |
| IA-04-09 | Trên toast hoặc thông báo trạng thái đang tải được kích hoạt bởi hành động không đồng bộ, thông báo phải được đọc cho công nghệ hỗ trợ mà không buộc đổi focus bàn phím khỏi nhiệm vụ hiện tại của người dùng. | WCAG 2.2 AA — SC 4.1.3 Status Messages | AI | |
| IA-04-10 | Trên một phần tử cập nhật theo thời gian thực (ví dụ badge live hoặc số đếm phản ánh thay đổi trạng thái được thực hiện ở nơi khác), thay đổi phải được phản ánh trực quan trên màn hình mà không cần người dùng tự làm mới trang. | Norman — Feedback | AI | |

---
