//PAGE
import Home from "components/Home";
import Landing from "components/Landing";
import NotFound from "components/NotFound";

//LOGIN_FLOW
import Verify from "components/Verify";
import AddChildren from "components/AddChildren";
import History from "components/History";
import MyFavorite from "components/MyFavorite";

//USER PAGE
import Achievement from "components/Achievement";

//COURSE PAGE
import Course from "components/Course";
import Info from "components/Info";
import CourseFinish from "components/CourseFinish";

import KnowledgeFinish from "components/KnowledgeFinish";

import Ranking from "components/Ranking";
import locale from "config/locale";

let _auth = [
  {
    path: "/",
    key: "Home",
    tag: "Home",
    component: Home,
    preLogin: Landing,
    exact: true
  },
  {
    path: "/course/:course_id",
    key: "Course",
    tag: "Course",
    component: Course,
    exact: true
  },
  {
    path: "/course/info/:course_id",
    key: "CourseInfo",
    tag: "CourseInfo",
    component: Info,
    exact: true
  },
  {
    path: "/achievements",
    key: "Achievement",
    tag: "Achievement",
    component: Achievement,
    exact: true
  },
  {
    path: "/add-children",
    key: "AddChildren",
    tag: "AddChildren",
    component: AddChildren,
    exact: true
  },
  {
    path: "/verify",
    key: "Verify",
    tag: "Verify",
    component: Verify,
    exact: true
  },
  {
    path: "/ranking",
    key: "Ranking",
    tag: "Ranking",
    component: Ranking,
    exact: true
  },
  {
    path: "/history",
    key: "History",
    tag: "History",
    component: History,
    exact: true
  },
  {
    path: "/favorite",
    key: "Favorite",
    tag: "Favorite",
    component: MyFavorite
  },
  {
    path: "/coursefinish",
    key: "CourseFinish",
    tag: "CourseFinish",
    component: CourseFinish,
    exact: true
  },
  {
    path: "/knowledgefinish",
    key: "KnowledgeFinish",
    tag: "KnowledgeFinish",
    component: KnowledgeFinish,
    exact: true
  }
];

let _normal = [
  {
    path: "/register/:family_token?",
    key: "Register",
    tag: "Register",
    component: Landing
  },
  {
    path: "/404",
    key: "404",
    tag: "404",
    component: NotFound,
    exact: true
  },
  {
    from: "*",
    to: "/404",
    action: "redirect"
  },
  {
    from: "/:error",
    to: "/error",
    action: "redirect"
  }
];

const data = {
  location: undefined,
  lang: undefined,
  vo_lang: undefined
};

/**
 * TODO :
 * NO LOCATION PARAM , GLOBALROUTE = FALSE
 * SOLUTION : LOCATION = SETTING_LOCATION
 * LOCATION PARAM , GLOBALROUTE = TRUE
 * SOLUTION : LOCATION = PARAM.LOCATION
 */

export const globalRoute = locale.GLOBAL_ROUTE; // true : www.evifamily.com/hk , false : www.evifamily.com.hk
export const ipLocation = locale.LOCATION; //从服务器获得 ip地址 如果获取失败 用默认的

export const DEFAULT_LANG =
  data.lang || locale.SUPPORT_LOCALES[ipLocation].lang[0];
export const DEFAULT_VO_LANG =
  data.vo_lang || locale.SUPPORT_LOCALES[ipLocation].vo_lang[0];
export const ROUTE_CONFIG = locale;
export const ROUTE_LIST = [
  ..._auth.map(_route => {
    _route["auth"] = true;
    return _route;
  }),
  ..._normal.map(_route => {
    _route["auth"] = false;
    return _route;
  })
];
