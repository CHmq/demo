import React, { Component } from "react";
import { Layout, Spin, Icon} from "antd";
import { connect } from "react-redux";

import MyHeader from "components/common/Header";
import MyFooter from "components/common/Footer";

import user from "components/services/userService";
import log from "components/services/logService";

import { toast } from "react-toastify";

const {Content} = Layout;

class EVIFrame extends Component {

    pv = null;
    pvTime = 0;
    startTime = 0;
    $route = {};

    constructor(props) {
        super(props);
        this.state = {
            $route: this.getRoute()
        };
    }
    
    getRoute = () => {
        let {
            $language: currentLanguage,
            $location: currentLocation,
            $voLanguage: currentVoLanguage,
            $rootURL: locationUrl,
            match,
            tag,
            history
        } = this.props;
        
        let route = {
                currentLanguage,
                currentLocation,
                currentVoLanguage,
                locationUrl,
                tag: tag,
                realUrl: match.url.replace(locationUrl.slice(0, -1), "").replace(("/" + currentLocation), ""),
                history
        };
            
        user.setLang(this.props.$language.value);
        return route;
    }

    async componentDidMount() {
        let {
            initRoute,
            initUser,
            setMerchant,
            $rootURL: locationUrl
        } = this.props;

        initRoute(this.getRoute());

        user.me().then(($user) => {
            initUser($user);
            if (!!user.isStaff() && !user.getMID()) {
                let merchantID = user.staff().merchant_id;
                setMerchant(merchantID);
                user.setMID(merchantID);
            }
        }).then(() => {
            log.PV(this.state.$route);
        }).catch(({ result, msg }) => {
            setMerchant("");
            if (!!msg) {
                toast.error(msg, {
                    autoClose: 2000,
                    position: toast.POSITION.TOP_CENTER,
                    onClose: () => {
                        window.location = locationUrl;
                    }
                });
        }
        });

        this.startTime = (new Date().getTime()) / 1000;
        window.addEventListener('beforeunload', this.logPageStay);
    }

    componentWillUnmount() {
        log.stay(this.props.route, ((new Date().getTime()) / 1000) - this.startTime);
        window.removeEventListener('beforeunload', this.logPageStay);
    }

    logPageStay = (e) => {
        log.exit(this.props.route, ((new Date().getTime()) / 1000) - this.startTime);
    }

    render() {
        const {locationUrl, $language, noFrame} = this.props;
        const EVILoad = <Icon type="loading" style={{fontSize: 100}} spin />;


        return (
                <Layout style={{backgroundColor: "#fff", minHeight: "100%"}}>
                    {noFrame !== true ?
                                (<MyHeader 
                                    locationUrl={locationUrl} 
                                    languageUrl={$language.url} />) : {} }
                    <Content style={{flex: 1, paddingTop: '76px' , flexDirection: "column" , ...(!!user.isLoading() ? {alignItems: "center", justifyContent: "center", display: "flex"} : {})}}>
                        { !!user.isLoading() ? <div className={"d-flex"}><Spin indicator={EVILoad} /></div> : React.cloneElement(this.props.children, {...this.props})}
                    </Content>
                    { noFrame !== true ?
                                (<MyFooter
                                    locationUrl={locationUrl} 
                                    languageUrl={$language.url} />) : {} }
                </Layout>
                );
    }
}

function mapStateToProps( state , ownProps) {
    const { route, user, translations, merchant } = state;
    return {route, user, translations, merchant};
}

function mapDispatchToProps(dispatch) {
    return {
        initRoute: payload => dispatch({type: "initRoute", payload}),
        initUser: payload => dispatch({type: "INIT", payload}),
        setMerchant: payload => dispatch({type: "setMerchant", payload}),
        updateFileName: payload => dispatch({type: "updateFileName", payload})
    };
}

export default connect(
        mapStateToProps,
        mapDispatchToProps
        )(EVIFrame);