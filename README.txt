ทะเบียนวิสัญญี Dashboard - Desktop Version

เหมาะสำหรับใช้บนคอมเป็นหลัก
- มีหน้าโหลดแบบนุ่มขึ้น
- พยายาม cache หน้า Apps Script ล่าสุดไว้สำหรับกรณีเน็ตสะดุด
- มือถือยังแนะนำให้ใช้ลิงก์ Apps Script เดิมโดยตรง

วิธีอัปเดตบน GitHub
1) อัปโหลดไฟล์ทั้งหมดใน zip นี้ทับของเดิม
2) รอ GitHub Pages deploy ใหม่
3) กด Ctrl+F5 หรือรีโหลดแบบไม่ใช้ cache 1 ครั้ง

หมายเหตุ
- ถ้าจะให้ iframe โหลดได้ ต้องมี
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  ใน doGet(e) ของ Apps Script
- Offline mode ในชุดนี้คือดูหน้าเวอร์ชันล่าสุดที่เคยเปิดสำเร็จ ไม่ใช่บันทึกข้อมูลใหม่แบบ offline
