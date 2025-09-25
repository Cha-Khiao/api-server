window.onload = function () {
  const serverSection = document.createElement('div');
  serverSection.innerHTML = "<h2>Servers</h2>";

  const servers = [
    {
      url: "https://api-server-seven-zeta.vercel.app/",
      description: "Production Server"
    },
    {
      url: `http://localhost:${window.location.port}`,
      description: "Development Server"
    }
  ];

  // สร้าง HTML สำหรับแสดงเซิร์ฟเวอร์
  servers.forEach(server => {
    const serverDiv = document.createElement('div');
    const description = document.createElement('p');
    description.textContent = `${server.description}: ${server.url}`;
    
    // ปุ่มคัดลอก URL
    const copyButton = document.createElement('button');
    copyButton.textContent = 'คัดลอกลิงก์';
    copyButton.onclick = function () {
      navigator.clipboard.writeText(server.url)
        .then(() => {
          alert('ลิงก์ถูกคัดลอกแล้ว');
        })
        .catch((error) => {
          alert('ไม่สามารถคัดลอกลิงก์ได้');
        });
    };

    serverDiv.appendChild(description);
    serverDiv.appendChild(copyButton);
    serverSection.appendChild(serverDiv);
  });

  // แสดงส่วนนี้บนหน้า UI ของ Swagger
  const apiDocs = document.querySelector('#swagger-ui');
  apiDocs.prepend(serverSection);

  // เพิ่มลิงก์ดาวน์โหลดไฟล์ Swagger Spec
  const downloadLink = document.createElement('a');
  downloadLink.innerText = 'ดาวน์โหลด Swagger Spec';
  downloadLink.href = '/swagger-spec.json'; // ลิงก์ดาวน์โหลดไฟล์ Swagger JSON
  downloadLink.download = 'swagger-spec.json';
  apiDocs.appendChild(downloadLink);
};
