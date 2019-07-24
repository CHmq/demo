import { ROUTE_CONFIG , ROUTE_LIST  , DEFAULT_LANG , DEFAULT_VO_LANG , globalRoute , ipLocation } from "components/routes/config";
import { RouteAdapter } from "components/routes/adapter";


function _getPath(pathURL, langURL, locationURL) {
    let $pathURL = pathURL || '';
    let $langURL = langURL || '';
    let $locationURL = locationURL || '';

    let $locationPath = !!$locationURL ? ('/' + $locationURL) : '';
    let $langPath = !!$langURL ? ('/' + $langURL) : '';
    return $locationPath + $langPath + $pathURL;
}

function _genRoute(_route, _lang) {
    _route['$location'] = ipLocation;
    _route['$language'] = DEFAULT_LANG;
    _route['$voLanguage'] = DEFAULT_VO_LANG;
    _route['$rootURL'] = _getPath('', DEFAULT_LANG.url, ipLocation);
    _route['key'] = _route.key || _route.from;
    let $multiLang = Object.keys(ROUTE_CONFIG.SUPPORT_LOCALES).map(_location => {
        if ((!globalRoute && _location !== ipLocation) ||
                (!!globalRoute && !ROUTE_CONFIG.SUPPORT_LOCALES[_location].global)) {
            return null;
        }

        let _defaultLang = ROUTE_CONFIG.SUPPORT_LOCALES[_location].lang[0];
        let _defaultVOLang = ROUTE_CONFIG.SUPPORT_LOCALES[_location].vo_lang[0];
        return [ROUTE_CONFIG.SUPPORT_LOCALES[_location].lang.map(_lang => {
                let _global = ROUTE_CONFIG.SUPPORT_LOCALES[_location].global;
                let isRedirect = _lang.value === _defaultLang.value || _route.action === "redirect" || false;
                let __route = {..._route,
                    key: ((_route.key || _route.from) + '-' + _location + '-' + _lang.value),
                    path: _getPath(_route.path, _lang.url, (!!_global ? _location : '')),
                    action: (isRedirect) ? "redirect" : undefined,
                    from: _getPath(_route.path || _route.from, _lang.url, (!!_global ? _location : '')),
                    to: _getPath(_route.path || _route.to, '', (!!_global ? _location : '')),
                    $location: _location,
                    $language: _lang,
                    $voLanguage : _defaultVOLang,
                    $rootURL: _getPath('/', _lang.url, (!!_global ? _location : ''))
                };
                return __route;
            }), {..._route,
                key: ((_route.key || _route.from) + '-' + _location),
                path: _getPath(_route.path, '', (!!globalRoute ? _location : '')),
                action: _route.action || undefined,
                $location: _location,
                $language: _defaultLang,
                $voLanguage : _defaultVOLang,
                $rootURL: _getPath('/', '', (!!globalRoute ? _location : ''))}].flat();
    });
    _route['path'] = _getPath(_route.path, (_lang || {'url': undefined}).url);
    if (!!globalRoute) {
        _route['action'] = "redirect";
        _route['from'] = _route.path || _route.from;
        _route['to'] = _getPath(_route.path || _route.to, '', (!!globalRoute ? ipLocation : ''));
    }
    let ret = [...$multiLang, ...[_route]];
    return ret.filter((_item => {
        return !!_item;
    })).flat();
}


let ROUTE_SETTINGS = (ROUTE_LIST.map(_route => {
    return _genRoute(_route);
})).flat();


function _batchRoute(_route) {
//    console.log(_route);
    let ret = _route.map(_route => {
        return RouteAdapter({..._route});
    });
//    console.log(ret);
    return ret;
}

export const defaultRoute = (_batchRoute(ROUTE_SETTINGS));
export default {
  defaultRoute
};