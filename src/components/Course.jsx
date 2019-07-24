import React, { Component } from "react";
import { Row, Col,  Icon, Modal} from "antd";
import { connect } from "react-redux";
import intl from "react-intl-universal";

// import InfiniteScroll from "react-infinite-scroller";

import Banner from "components/common/Banner";
import TitleTip from "components/common/TitleTip";
import Video from "components/common/Video";
import ShooLogo from "components/common/SchooLogo";
import DraggerImgUploading from "components/common/UploadingFile";



import memu from "assets/css/memulist.module.scss";

import course from "components/services/courseService";
import school from 'components/services/school';

import EVICourse from "components/course/CourseTemplate";
import CourseList from "components/course/CourseList";



/**
 * 生活知識页面
 *
 * @export 生活知識页面
 * @class Knowledge
 * @extends {Component}
 */

class Knowledge extends Component {

    $$isMount = false;
    
    $$course = {
        current : {
            isLoading : () => true
        }
    };

    state = {
        course: {
            id : null,
            banner: null,
            logo: null,
            name: null,
            video: null,
            school_id : null
        }, //banner数据
        listData: [], //list 数据
        URLid: "", //url参数id
        skeleton: false, //骨架屏状态
        visible: false, //对话框状态
        updateItem: [], //編輯課程的item
        updateData: {}, //编辑页面数据
        formData: {}, //课程资料页面传过来的表单数据
        sortData: {}, //排序页面数据
        activeKey: "a", //tab的key
        disabled: true, //tab是否禁用
        uploadingFile: false, // 上传图片/影片的弹框 默认关闭
        uploadingFileType: '',
        treeData: [], //treeSelect 数据,
        selectList: [],
        
        
        staffPermit : {
            get_list : false,
            get : false,
            update : false,
            add : false,
            delete : false
        },
        
        isPlay : false,
        $$loading: false,
        cousreID: null,
        offset: 0,
        limit: 50,
        result: [],
        total: 0
    };

    constructor(props) {
        super(props);
        this.$$course = React.createRef();
    }

    componentDidMount = async() => {
        this.$$isMount = true;
        if (!this.$$isMount) {
            return;
        }
        this.props.updateFileName("home");
    }
    
    componentWillUnmount = async () => {
        this.$$isMount = false;
    }
    
    isLoading = () => {
        return !!this.$$course.current ? this.$$course.current.isLoading() : true;
    }
    
    showModal = () => {
        if (!!this.$$isMount) {
            this.setState({
                visible: true
            });
        }
    }

    setUploadingFile = (uploadingFile, uploadingFileType) => {
        if (!!this.$$isMount) {
            this.setState({uploadingFile, uploadingFileType});
        }
    }

    //上傳成功
    uploadingDone = () => {
        this.setUploadingFile(false);
        this.$$course.current.getData();
    }

    createModal = (title = '') => {
        return (
                <Modal
                    title={title}
                    centered
                    bodyStyle={{backgroundColor: "#fff"}}
                    visible={this.state.uploadingFile}
                    onCancel={() => this.setUploadingFile(false)}
                    footer={null}
                    maskClosable={false}
                    destroyOnClose={true}
                    >
                    <DraggerImgUploading 
                        URLid={this.state.course.id} 
                        type={this.state.uploadingFileType}
                        onCancel={() => this.uploadingDone()}
                        />
                </Modal>
                );
    }

    ShowUploading = (type = []) => {
        this.setUploadingFile(true, type);
    }

    getData = async(i_reset = true) => {
        return this.$$course.current.getData(i_reset);
    }
    //关闭对话框
    onCancel = () => {
        if (!!this.$$isMount) {
            this.setState({
                visible: false,
                activeKey: "a",
                disabled: true
            });
        }
    }

    onRef = ref => {
        this.child = ref;
    }

    //显示新增课程
    showAddCourse = e => {
        this.child.showModal();
    }

    //memu编辑
    async handleMemuSet(item, e) {
        e.preventDefault();
        await course.get(item.ref_id).then(ret => {
            if (!!this.$$isMount) {
                this.setState({updateData: ret, updateItem: ret.item});
            }
        }).catch(_msg => {
            console.log(_msg);
        });
        if (!!this.$$isMount) {
            this.setState({
                visible: true
            });
        }
    }
    // camera编辑
    handleCamera = async(item, e) => {
        e.preventDefault();
        this.ShowUploading('file');

        if (!!this.$$isMount) {
            this.setState({
                URLid: item.ref_id,
                type: 'file'
            });
        }
    }
    //获取课程资料的表单数据
    getFormData(item, data) {
        if (!!this.$$isMount) {
            this.setState({
                formData: item,
                sortData: data
            });
        }
    }
    //下一步
    nextStep() {
        if (!!this.$$isMount) {
            this.setState({
                activeKey: "b",
                disabled: false
            });
        }
    }
    //課程排序頁面上一步
    sortCancel() {
        if (!!this.$$isMount) {
            this.setState({
                activeKey: "a",
                disabled: true
            });
        }
    }
    //treeSelect数据处理
    treeSelectData = async () => {
        let gList = await school.getClassList().then(ret => ret.rows).catch(err => []);
        let data = Object.values(gList.reduce((_list, { grade_id, year_name, grade_name, class_name, grade_type, class_id }) => {
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

        if (!!this.$$isMount) {
            this.setState({treeData: data});
        }
    }

    onSelect = (i_select) => {
        this.setState({selectList: i_select}, this.getData);
    }
    
    render() {
        const { translations} = this.props;
        const permitUpdate = this.state.staffPermit.update;
        
        
        return (
                <EVICourse
                    id="EVI-Course"
                    style={{position:"relative"}}
                    staffPermitCallback={ (permit) => { if(this.$$isMount) this.setState({staffPermit : permit});} }
                    getInfo={(info) => {if(this.$$isMount) this.setState({course : info}); }}
                    getList={({total , rows}) => {if(this.$$isMount) this.setState({total , rows});}}
                    getSectionList={(list) => {if(this.$$isMount) this.setState({listData : list});}}
                    courseID={this.props.match.params.course_id} 
                    ref={this.$$course}>
                    <Banner 
                        img={this.state.course.banner} 
                        style={{height: "66vh"}}
                        className={`${memu.bannerwarp} ${memu.bannermain}`} 
                        type="flex" justify="center" align="middle">
                        <React.Fragment>
                            <Col xs={{span: 23}} md={{span: 22}} lg={{span: 17}}style={{height: '100%', display: 'flex'}}>
                            <Col xs={24} md={!this.state.course.logo ? 21 : 24} className={memu.left}>
                            <Row type="flex" align="middle" justify={!this.state.course.logo ? "space-between" : "start"} style={{width: '100%', height: "100%"}}>
                                <Col xs={{span: 24}} md={{span: 11, offset: !this.state.course.logo ? 0 : 1}} lg={{span: !this.state.course.logo ? 8 : 10, offset: !this.state.course.logo ? 0 : 1}}
                                     style={{position: "relative", height: "100%"}}>
                                <TitleTip
                                    manage={permitUpdate}
                                    URLid={this.state.course.id}
                                    updateData={() => this.getData()}
                                    title={this.state.course.name}
                                    tip={this.state.course.description}
                                    color={"#3bc6ff"}
                                    />
                                </Col>
                                {!!this.state.course.video || !!permitUpdate ?
                                            (<Col xs={{span: 0}} md={{span: 10}} lg={{span: 8}} className={memu.video_container} style={{position: "relative", height: "100%"}}>
                                            <Video videosrc={this.state.course.video} playing={this.state.isPlay}>
                                                {permitUpdate && (<div className={`${memu.video_button} ${!this.state.course.video ? 'd-block' : ''}`} onClick={() => this.ShowUploading('video')}>{translations.initDone && intl.get("course_1.content.edit.video")}</div>)}
                                            </Video>
                                            </Col>) : ("")}
                            </Row>
                            </Col>
                            <Col xs={{span: 0}} md={{span: 3}} lg={{span: 3}}>
                            <div className={memu.shooLogo_container}>
                                <ShooLogo img={this.state.course.logo} />
                                {permitUpdate && (<div className={memu.shooLogo_button} onClick={() => this.ShowUploading('logo')}><Icon type="camera" /> {translations.initDone && intl.get("course_1.content.edit.logo")}</div>)}
                            </div>
                            </Col>
                            </Col>
                            <React.Fragment>
                                {this.createModal(translations.initDone && intl.get("course_1.content.ModalTitle"))}
                                {permitUpdate && (
                                    <div className={`${memu.banner_button}`} onClick={() => this.ShowUploading('banner')}>
                                        <Icon type="camera" />&nbsp;&nbsp;{translations.initDone && intl.get("course_1.content.edit.banner")}
                                    </div>
                                            )}
                            </React.Fragment>
                        </React.Fragment>
                    </Banner>
                    <CourseList sectionList={this.state.listData} EVICourse={this.$$course} />
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

/** redux 數據更新
 * initLanguageState  初始化 language  bool
 * updateTranslations 更新language 以渲染多语言
 */
function mapDispatchToProps(dispatch) {
    return {
        updateFileName: payload => dispatch({type: "updateFileName", payload}),
    };
}

export default connect(
        mapStateToProps,
        mapDispatchToProps
        )(Knowledge);
