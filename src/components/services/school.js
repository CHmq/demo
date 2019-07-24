import { client } from "./apiService";
import { API_URL } from "config/url";

const url = `${API_URL.resource}/school`;

//获取数据列表
export async function getClassList() {
  return await client.post({
    url: `${url}/get_class_list`
  });
}

export async function getClassTree() {
    return this.getClassList().then(ret => ret.rows).catch(err => []).then(gList =>  {
        return Object.values(gList.reduce((_list, { grade_id, year_name, grade_name, class_name, grade_type, class_id }) => {
            if (!_list[grade_id])
                _list[grade_id] = {
                    title: `${year_name} ${grade_name}`,
                    value: `${grade_id}-${grade_type}`,
                    key: `${grade_id}-${grade_type}`,
                    'children': []
                };
            _list[grade_id]['children'].push({
                title: `${grade_name}${class_name}`,
                value: `${grade_id}-${grade_type}-${class_id}`,
                key: `${grade_id}-${grade_type}-${class_id}`
            });
            return _list;
        }, {}));
    });
}


export default {
  getClassList,
  getClassTree
};