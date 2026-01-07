import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  const { name, keywords } = await request.json();

  const prompt = `
Bạn là copywriter chuyên viết mô tả sản phẩm cho website thương mại điện tử.

Viết MỘT bài mô tả hoàn chỉnh bằng tiếng Việt cho sản phẩm sau:

Tên sản phẩm: ${name}
Từ khóa: ${keywords || "không có"}

Yêu cầu:
- Không đưa ra nhiều phương án.
- Không liệt kê "lựa chọn 1,2,3".
- Có mở bài thu hút.
- Có đoạn mô tả chi tiết.
- Có gạch đầu dòng ưu điểm.
- Có đoạn kêu gọi mua hàng cuối bài.
- Văn phong tự nhiên, thân thiện, không giống máy móc.

Chỉ trả về nội dung mô tả.
`;

  const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "Bạn là copywriter chuyên nghiệp. Chỉ viết một bài mô tả sản phẩm hoàn chỉnh, không đưa ra lựa chọn.",
        temperature: 0.7,
      },
    });

    return Response.json({ text: response.text }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Kết nối AI thất bại" }, { status: 500 });
  }
}
