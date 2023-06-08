import * as dotenv from "dotenv";
import vectorJson from "./productEmbeddings.json";
import {
  ConsistencyLevelEnum,
  DataType,
  MetricType,
  MilvusClient,
} from "@zilliz/milvus2-sdk-node";
dotenv.config();
const client = new MilvusClient({
  address: process.env.MILVUS_URL,
  ssl: true,
  username: process.env.MILVUS_USERNAME,
  password: process.env.MILVUS_PASSWORD,
});

(async () => {
  const promises = vectorJson.map(async (vector, index) => {
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
      consistency_level: ConsistencyLevelEnum.Bounded,
      metric_type: MetricType.IP,
    };

    const startDate = Date.now();
    const results = await client.search(search);

    console.log(results.results.length);

    return Date.now() - startDate;
  });
  console.log((await Promise.all(promises)).sort((a, b) => b - a));
})();
