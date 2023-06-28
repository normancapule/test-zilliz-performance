import * as dotenv from "dotenv";
import vectorJson from "./productEmbeddings.json";
import Aigle from "aigle";
import { batchCallPromises } from "./batchCallPromises";
import { MetricType, MilvusClient } from "@zilliz/milvus2-sdk-node";

(async () => {
  const client = new MilvusClient({
    address: process.env.MILVUS_URL,
    ssl: true,
    username: process.env.MILVUS_USERNAME,
    password: process.env.MILVUS_PASSWORD,
  });
  const baseSearch = {
    collection_name: "catalog_upc_crops_2023_04_29",
    topk: 10,
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

  const promises = vectorJson.map((vector, index) => {
    return client.search({ ...baseSearch, vector });
  });

  let startDate = Date.now();
  await Aigle.resolve(promises).parallel();
  console.log("Aigle Total ", Date.now() - startDate);

  startDate = Date.now();
  await batchCallPromises(vectorJson, (v) =>
    client.search({ ...baseSearch, vector: v })
  );
  console.log("async-await-queue Total ", Date.now() - startDate);
})();
