import { client } from "./apiService";
import { API_URL } from "config/url";

const url = `${API_URL.resource}/main`;

export async function getClassList(id,type,keyword,offset=0,limit=12) {
  const data = await client.post({
    url: `${url}/get_list`,
    form: {
      cat:id,
      item_type:type,
      keyword:keyword,
      offset:offset,
      limit:limit
    }
  });
  console.log(data);
  return data;
}

export async function addClass(value) {
  const data = await client.post({
    url: `${url}/add`,
    form:value
  });
  console.log(data);
  return data;
}

export async function updateClass(value) {
  const data = await client.post({
    url: `${url}/update`,
    form:value
  });
  console.log(data);
  return data;
}
// 获取课件详细的内容
export async function getClass(id) {
  const data = await client.post({
    url: `${url}/get`,
    form:{
      id
    }
  });
  console.log(data);
  return data;
}

export async function getFullInfo(id) {
  return await client.post({
    url: `${url}/get_full_info`,
    form: {
      id
    }
  });
}

export default {
  getClassList,
  addClass,
  updateClass,
  getClass,
  getFullInfo
}