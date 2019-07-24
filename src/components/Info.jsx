import React, { Component } from "react";
import { Row, Col,  Skeleton, } from "antd";
import { connect } from "react-redux";
// import intl from "react-intl-universal";

import Card from "components/common/Card";
import Banner from "components/common/Banner";

import favourite from "components/services/user_favourite";

import EVICourse from "components/course/CourseTemplate";
import CourseList from "components/course/CourseList";



class Content extends Component {

    $$mount = false;
    $$comment = null;
    $$course = {
        current: {
            isLoading: () => true
        }
    };
    state = {
        course: {
            id: null,
            banner: null,
            logo: null,
            name: null,
            video: null,
            school_id: null
        }, //banner数据
        bannerData: [],
        sectionList: [],
        urlId: "",
        skeleton: false,
        language: {}, // 翻译

        $$loading: false,
        cousreID: null,
        offset: 0,
        limit: 50,
        result: [],
        total: 0,

        staffPermit: {
            update: false
        }
    };

    constructor(props) {
        super(props);
        this.$$comment = React.createRef();
        this.$$course = React.createRef();

    }

    componentDidMount = async() => {
        this.$$mount = true;
        if (!this.$$mount) {
            return;
        }
        this.props.updateFileName("home");
    }

//  async componentDidMount() {
//    try {
//      const data = await course.get(urlId);
//      bannerRow = data;
//      const { rows } = await courseItem.get_list(urlId);
//      listRow = rows;
//      listRow.forEach((item) => {
//        item.star = false; // 给数据加上star的状态
//      })
//      const likeData = await favourite.getList();
//      likeRow = likeData.rows;
//    } catch (err) {
//      console.log(err);
//    }
//
//    const listIdArray = []; // 存放section_id
//
//    for (let listItem of listRow) {
//      listIdArray.push(listItem.section_id);
//      for(let likeItem of likeRow) {
//        //ref_id, res_id对比
//        if(listItem.ref_id === likeItem.res_id){
//          listItem.star = true;
//        }
//      }
//    }
//    

//    if (this.state.sectionList.length) {
//      this.setState({ skeleton: true });
//    }
//    if (this.state.bannerData.banner) {
//      this.setState({ bannerSkeleton: true });
//    }
//  }


    componentWillUnmount = async () => {
        this.$$mount = false;
    }

    isLoading = () => {
        let loading = !!this.$$course.current ? this.$$course.current.isLoading() : true;
        console.log(loading);
        return loading;
    }

    //点击星星
    async handleClickStar(item, index, e) {
        e.stopPropagation();
        let data = this.state.sectionList;
        let isTrue = item.star;
        let type = isTrue ? 'starDelete' : 'starAdd';

        await favourite[type](item.ref_id).then(ret => {
            data[0].data[index].star = !isTrue;
            if (this.$$mount) {
                this.setState({sectionList: data});
            }
            console.log(ret);
        }).catch(_msg => {
            console.log(_msg);
        });
    }

    render() {
        // const {locationUrl, translations} = this.props;
        const styleCss = {
            background: {
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: `url(${this.state.course.background})`
            }
        };
        // 多语言翻译
        // const Language = {
        //     title: translations.initDone && intl.get("info.content.Message.title"),
        //     btnword: translations.initDone && intl.get("info.content.Message.btnword"),
        //     tiptitle: translations.initDone && intl.get("info.content.Message.tiptitle"),
        //     commentsword: translations.initDone && intl.get("info.content.Message.commentsword"),
        //     Submitbtn: translations.initDone && intl.get("info.content.Message.Submitbtn"),
        // };

        const comment = (null);
//        const comment = (<Comment ref={this.$$comment} Language={Language} width="100%" title={Language.title} urlId={this.state.course.id} />);
        return (
                <EVICourse
                    id="EVI-Course"
                    style={{position: "relative"}}
                    staffPermitCallback={ (permit) => {if (this.$$mount)this.setState({staffPermit: permit});} }
                    getInfo={(info) => {if (this.$$mount)this.setState({course: info});} }
                    getList={({total, rows}) => {if (this.$$mount)this.setState({total, rows});}}
                    getSectionList={(list) => {if (this.$$mount)this.setState({sectionList: list});}}
                    courseID={this.props.match.params.course_id} 
                    ref={this.$$course}>
                    <Row>
                        <Skeleton loading={!!this.isLoading()} active paragraph={{rows: 8}} >
                            <Banner img={this.state.course.banner} height={"18rem"} />
                        </Skeleton>
                    </Row>
                    <Row type="flex" justify="center" style={styleCss.background}>
                        <Col xs={22} md={24} style={{marginTop: "1rem", maxWidth: "1200px"}}>
                        <Col xs={24} md={8} lg={6} xl={6} style={{padding: "0 1rem"}}>
                        <Card
                            width="100%"
                            title={this.state.course.name}
                            html={this.state.course.description}
                            urlId={this.state.course.id}
                            />
                        <Col xs={0} md={24}>{comment}</Col>
                        </Col>
                        <Col
                            xs={24}
                            md={{span: 16, offset: 0}}
                            lg={{span: 18, offset: 0}}
                            style={{padding: "0"}}
                            >
                        <CourseList 
                            noBackground={true}
                            sectionList={this.state.sectionList}
                            EVICourse={this.$$course}
                            />
                        </Col>
                
                        <Col xs={24} md={0} lg={0}>{comment}</Col>
                        </Col>
                    </Row>
                </EVICourse>
                );
    }
}

/** redux 獲得全局數據
 * route  route data (url, language) --暫時沒有用到
 * user  user data (用戶數據)
 */
function mapStateToProps( { route, user, translations }) {
    return {
        route,
        user,
        translations
    };
}

export default connect(mapStateToProps)(Content);
