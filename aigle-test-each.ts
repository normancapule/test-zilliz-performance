import "dotenv/config";
import Aigle from "aigle";
import vectorJson from "./productEmbeddings.json";
import { MetricType, MilvusClient } from "@zilliz/milvus2-sdk-node";

(async () => {
  const client = new MilvusClient({
    address: process.env.MILVUS_URL,
    ssl: true,
    username: process.env.MILVUS_USERNAME,
    password: process.env.MILVUS_PASSWORD,
  });

  const mainResults: any[] = []

  const iter = async (vector: any) => {
    const search = {
      collection_name: "catalog_upc_crops_2023_04_29",
      topk: 10,
      vector,
      output_fields: [
        "id",
        "mb_image_id",
        "brand",
        "product_name",
        "size",
        "upc",
        "sector",
        "department",
        "major_category",
        "br_image_url",
        "indexed_image_url",
        "image_width",
        "image_height",
      ],
      metric_type: MetricType.IP,
    };

    const startDate = Date.now();
    const results = await client.search(search);

    if (results.results.length === 0) {
      throw new Error("No results found");
    }

    mainResults.push(Date.now() - startDate)
    return Date.now() - startDate;
  };

  const startDate = Date.now();
  await Aigle.resolve(vectorJson).each(iter)
  console.log("Total ", Date.now() - startDate)
  console.log("Average", mainResults.reduce((a, b) => a + b, 0) / mainResults.length);
})();
