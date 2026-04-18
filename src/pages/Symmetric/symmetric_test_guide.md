# Tài liệu & Test: Symmetric Encryption (Mã hóa Đối xứng)

## 1. Khái niệm cơ bản
Mã hóa đối xứng (Symmetric Encryption)** là phương pháp mã hóa sử dụng cùng một khóa (Secret Key) cho cả hai quá trình: Mã hóa (Encrypt) và Giải mã (Decrypt).

### Các thuật toán (Algorithms) hỗ trợ:
- DES (Data Encryption Standard): Là thuật toán đời đầu. Hiện nay được xem là không còn an toàn (do độ dài khóa ngắn, chỉ 56-bit) và dễ bị bẻ khóa bởi máy tính hiện đại. Thường chỉ dùng cho mục đích học tập hoặc các hệ thống cũ (Legacy). * **Nguyên lý hoạt động:** Thuật toán chia dữ liệu gốc (Plaintext) thành các khối 64-bit và sử dụng một khóa có độ dài thực tế là 56-bit. Nó hoạt động dựa trên cấu trúc mạng Feistel. Dữ liệu sẽ phải đi qua 16 vòng biến đổi phức tạp, bao gồm các phép hoán vị và thay thế kết hợp với khóa để tạo ra mã hóa.

- 3DES (Triple DES): Là bản nâng cấp của DES bằng cách chạy 
thuật toán DES 3 lần liên tiếp với các khóa khác nhau. An toàn hơn DES nhưng tốc độ xử lý khá chậm. Nguyên lý hoạt động: 3DES được tạo ra bằng cách chạy thuật toán DES 3 lần liên tiếp trên mỗi khối dữ liệu 64-bit. Quá trình phổ biến nhất là EDE (Encrypt - Decrypt - Encrypt): Mã hóa bằng Khóa 1 -> Giải mã bằng Khóa 2 -> Mã hóa lại bằng Khóa 3.

- AES (Advanced Encryption Standard): Là tiêu chuẩn mã hóa quốc tế hiện hành (được chính phủ Mỹ và thế giới tin dùng). Rất an toàn, tốc độ mã hóa cực nhanh. Đây là thuật toán được khuyên dùng nhất trong thực tế. Nguyên lý hoạt động: dựa trên mạng SPN (Substitution-Permutation Network) thay vì mạng Feistel. Dữ liệu được chia thành các khối cố định 128-bit. Quá trình mã hóa lặp lại qua nhiều vòng (10, 12 hoặc 14 vòng tùy thuộc vào độ dài khóa là 128, 192 hay 256-bit). Mỗi vòng bao gồm 4 bước toán học ma trận khép kín:
    - SubBytes: Thay thế byte (tạo sự hỗn loạn).
    - ShiftRows: Dịch vòng các hàng.
    - MixColumns: Trộn các cột (tạo sự khuếch tán).
    - AddRoundKey: Phép XOR với khóa của vòng hiện tại.

### Các chế độ hoạt động (Modes of Operation):
Vì dữ liệu thường dài hơn kích thước một khối (block) mà thuật toán xử lý, ta cần các "Chế độ" để chia nhỏ và xử lý chuỗi khối này:
- ECB (Electronic Codebook): Chế độ đơn giản nhất. Mỗi khối dữ liệu được mã hóa độc lập. **Nhược điểm:** Nếu 2 khối dữ liệu gốc giống hệt nhau, chúng sẽ sinh ra 2 khối mã hóa giống hệt nhau, làm lộ mẫu dữ liệu, không an toàn cho file hình ảnh, văn bản có cấu trúc lặp.
- CBC (Cipher Block Chaining): Khối dữ liệu sau sẽ bị ảnh hưởng bởi kết quả của khối dữ liệu trước nó (thông qua phép XOR). **Ưu điểm:** An toàn hơn ECB rất nhiều vì ẩn được các mẫu dữ liệu lặp lại. Đây là chế độ **khuyên dùng (Recommended)**.

---

## 2. Test

### Case 1: Luồng chuẩn (Happy Path) với AES - CBC

1.  Mã hóa
    Chọn Algorithm `AES` và Mode `CBC`.
    Nhập Plaintext
    Bấm Generate Key hoặc tự nhập 
    Bấm Encrypt-> Result xuất hiện đoạn Ciphertext 

2.  Giải mã
    Copy đoạn Ciphertext ở ô Result dán ngược lên ô Plaintext / Ciphertext (có thể copy đoạn Ciphertext ròi F5).
    Giữ nguyên Key ban đầu, bấm Decrypt.
    Ô Result hiện lại đúng dòng chữ trước đó.

### Case 2: Bắt lỗi khi sai cấu hình (Sai Key hoặc Sai Mode)
Kiểm tra xem hệ thống có bị crash khi người dùng nhập sai thông tin giải mã không.
1.  Thực hiện lại bước Mã hóa của Case 1 để có một đoạn Ciphertext hợp lệ.
2.  Copy Ciphertext dán lên ô nhập liệu.
3.  Thử đổi Key thành một chuỗi sai hoặc Mode từ CBC sang ECB.
4.  Bấm Decrypt.
5.  Giao diện không bị sập. Ô Result hiển thị thông báo lỗi 

### Kịch bản 3: Bắt lỗi rỗng (Empty Input)
Đảm bảo người dùng không thể thực thi nếu chưa nhập đủ dữ liệu.
1.  Xóa trắng ô Text và ô Key (nếu có dữ liệu ).
2.  Bấm Encrypt hoặc Decrypt.
3.  Hiển thị cảnh báo (Alert) yêu cầu nhập đầy đủ thông tin.