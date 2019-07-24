import { client } from "./apiService";
import { API_URL } from "config/url";

const url = `${API_URL.resource}/course_item`;


//选择弹框数据
export async function get(i_courseID) {
  return await client.post({
    url: `${url}/get`,
    form: {
      i_courseID
    }
  });
}

// urlId url的参数id
export async function get_list(i_courseID , i_gradeList = undefined , offset = 0 , limit = 20) {
  return await client.post({
    url: `${url}/get_list`,
    form:{
      course_id: i_courseID,
      grade : (Array.isArray(i_gradeList) ? i_gradeList.join(',') : i_gradeList),
      offset,
      limit
    }
  });
}

export default {
  get,
  get_list
};
