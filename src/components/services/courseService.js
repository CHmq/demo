import { client } from "components/services/apiService";
import { API_URL } from "config/url";

const url = `${API_URL.resource}`;

export async function getMenu(language, school_id) {
  return await client.post({
    url: `${url}/course/get_menu`
  }).then(ret => {
    return ret.rows;
  });
}

//探索彈出框api
export async function ExploratioList(offset, limit,urlId) {
  return await client.post({
    url: `${url}/user_record/get_list`,
    form: {
      course_id: urlId,
      offset,
      limit
    }
  });
}

// urlId url的参数id
export async function get(urlId) {
  return await client.post({
    url: `${url}/course/get`,
    form: {
      id: urlId
    }
  });
}

export async function getFullInfo(i_courseID = null) {
    return client.post({
        url : `${url}/course/get_full_info`,
        form : {
            id : i_courseID
        }
    })
}


//新增課程
export async function getCourseList() {
    console.log('getCourseList');
  return await client.post({
    url: `${API_URL.resource}/course/get_tag`,
    form: {}
  })
}

//新增課程子分類頁面數據
export async function search(tag = null, keyword="", type=[] , offset = 0 , limit = 5 , show_total = false) {
  let _type = [].concat(...(type.map(_item => {
          return _item.split(",");
      })));
  return await client.post({
    url: `${API_URL.resource}/search`,
    form: {
      tag : tag,
      keyword: keyword,
      type: _type,
      offset : (offset * limit),
      limit : limit
    }
  }).then(ret => {
      return !!show_total ? ret : ret.rows;
  }).catch(err => {
      return !!show_total ? {total : 0 , rows : []} : [];
  });
}
//觀看記錄頁面暫時api
export async function history(offset=0, limit=10) {
  return await client.post({
    url: `${API_URL.resource}/main/get_list`,
    form: {
      offset,
      limit
    }
  })
}

export async function subClassTag(id) {
  console.log('get_sub_class');
  return await client.post({
    url: `${API_URL.resource}/course/get_tag`,
    form: {
      id : id
    }
  })
}

//新增课程
export async function courseAdd(value, item) {
  return await client.post({
    url: `${API_URL.resource}/course/add`,
    form: {
      course_id: value.course_id,
      name: value.name,
      description: value.des,
      publish_time: value.start,
      end_time: value.end,
      grade: value.grade,
      status: value.status,
      item
    }
  })
}

//編輯課程
export async function courseUpdate(value, item) {
  return await client.post({
    url: `${API_URL.resource}/course/update`,
    form: {
      id: value.id,
      course_id: value.course_id,
      name: value.name,
      description: value.des,
      publish_time: value.start,
      end_time: value.end,
      grade: value.grade,
      status: value.status,
      item
    }
  })
}
export async function titleTipUpdate(value) {
  return await client.post({
    url: `${API_URL.resource}/course/update`,
    form: {
      id: value.id,
      name: value.name,
      description: value.description
    }
  })
}

export async function uploadFile(_permit, file) {
  return client.uploadOSS(_permit, file);
}

export async function getResourcePermit(i_fileMeta, i_formData) {
  return getUploadPermit("resource", "course", i_fileMeta, i_formData);
}

export async function getUserRecordAddPermit(i_fileMeta, i_formData) {
  return getUploadPermit("user_record", "add", i_fileMeta, i_formData);
}

export async function getUserRecordUpdatePermit(i_fileMeta, i_formData) {
  return getUploadPermit("user_record", "update", i_fileMeta, i_formData);
}

function getUploadPermit(i_controller, i_action, i_fileMeta, i_formData = {}) {
  var meta = {
    lastModified: i_fileMeta.lastModified,
    lastModifiedDate: i_fileMeta.lastModifiedDate,
    name: i_fileMeta.name,
    size: i_fileMeta.size,
    type: i_fileMeta.type
  };
  const formData = Object.assign({}, { meta: meta }, i_formData);
  return client.post({
    url: `${url}/upload/token/${i_controller}/${i_action}`,
    form: formData
  });
}

export default {
  getMenu,
  get,
  getFullInfo,
  getCourseList,
  subClassTag,
  ExploratioList,
  search,
  courseAdd,
  courseUpdate,
  history,
  uploadFile,
  getResourcePermit,
  getUserRecordAddPermit,
  getUserRecordUpdatePermit,
  titleTipUpdate
};
