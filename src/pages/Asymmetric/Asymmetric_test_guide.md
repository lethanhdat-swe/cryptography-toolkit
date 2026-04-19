1. Cách hoạt động của hệ thống RSA trong code
 Tổng quan

Ứng dụng React này dùng Web Crypto API để thực hiện:

Tạo cặp khóa RSA (public/private)
Mã hóa (encrypt) bằng public key
Giải mã (decrypt) bằng private key
Test tự động kiểm tra toàn bộ quá trình
 Các thành phần chính
1. Tạo key pair
generateKeyPair()
Tạo RSA-OAEP 2048-bit
Xuất ra dạng JWK:
publicKey
privateKey
2. Mã hóa
encryptRSA(plaintext, publicKeyJwk)

Quy trình:

Import public key (JWK → CryptoKey)
Encode text → bytes (TextEncoder)
Encrypt bằng RSA-OAEP
Encode kết quả sang Base64

 Output: ciphertext (chuỗi base64)

3. Giải mã
decryptRSA(ciphertextBase64, privateKeyJwk)

Quy trình:

Import private key
Decode Base64 → bytes
Decrypt bằng RSA-OAEP
Decode bytes → text

 Output: plaintext ban đầu

4. Test tự động
testEncryption()
Tạo key pair mới
Encrypt: "Hello, RSA!"
Decrypt lại
So sánh kết quả

 Nếu giống → PASS

 2. Các bước test RSA trong UI
 Bước 1: Tạo key
Nhấn: Generate New Key Pair
Hệ thống tạo:
Public Key (để encrypt)
Private Key (để decrypt)

 Bạn cần copy hoặc lưu private key

 Bước 2: Test Encrypt
Chuyển tab Encrypt
Nhập:
Plaintext (ví dụ: Hello)
Public Key (JWK)
Nhấn Encrypt
Nhận:
Ciphertext (Base64)

 Có thể:

Copy ciphertext
Load sang decrypt luôn
 Bước 3: Test Decrypt
Chuyển tab Decrypt
Nhập:
Ciphertext
Private Key
Nhấn Decrypt
Nhận:
Plaintext gốc
 Bước 4: Test tự động (quan trọng)

Nhấn:

Test RSA Encryption

Hệ thống sẽ:

Tạo key mới
Encrypt “Hello, RSA!”
Decrypt lại
Kiểm tra đúng/sai

 Nếu OK → popup:

RSA encryption test passed!

 Lưu ý quan trọng trong code
1. Giới hạn dữ liệu
if (data.length > 190)
RSA-2048 chỉ mã hóa được ~190 bytes
Không dùng cho text dài
2. Base64 encode
btoa(...)
Chuyển ciphertext sang dạng string để dễ copy
3. Key format
Dùng JWK (JSON Web Key)
Dễ copy/paste nhưng cần đúng format
 Tóm tắt 1 dòng

 Generate key → dùng public key encrypt → dùng private key decrypt → hoặc chạy test để verify toàn bộ pipeline.