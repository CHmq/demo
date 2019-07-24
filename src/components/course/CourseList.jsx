import React, { Component } from "react";
import { Row, Col, Button, Skeleton, Icon, Tabs, Modal, TreeSelect } from "antd";

import { connect } from "react-redux";
import intl from "react-intl-universal";

import InfiniteScroll from "react-infinite-scroller";
import Adapter from "components/common/resource/Adapter";

import Memulist from "components/common/Memulist";
import ManagePopup from "components/common/ManagePopup";
import DraggerImgUploading from "components/common/UploadingFile";
import LandingPopup from "components/LandingPopup";

import CourseEditor from "components/course/CourseEditor";
import CourseData from "components/CourseData";
import CourseSort from "components/CourseSort";

import memu from "assets/css/memulist.module.scss";

import course from "components/services/courseService";
import school from 'components/services/school';

const TabPane = Tabs.TabPane;
const {SHOW_PARENT} = TreeSelect;

class CourseList extends Component {

    $$init = false;
    $$courseEditor = null;

    state = {
        staffPermit: {
            get: false,
            get_list: false,
            add: false,
            update: false,
            delete: false
        },

        visible: false, //对话框状态
        updateItem: [], //編輯課程的item
        updateData: {}, //编辑页面数据
        formData: {}, //课程资料页面传过来的表单数据
        sortData: {}, //排序页面数据
        activeKey: "a", //tab的key
        disabled: true, //tab是否禁用
        uploadingFile: false, // 上传图片/影片的弹框 默认关闭


        classList: [],
        sectionList: [],
        isLoading: false,
        isMore: false,
        $$course: null,
        course: null,
        
        noBackground : false,
        targetID : null,

        offset: 0
    };

    componentDidMount = async() => {
        this.$$isMount = true;
        if (!this.$$isMount) {
            return;
        }
    }

    componentDidUpdate = async(prevProps, prevState) => {
        const {EVICourse , noBackground} = this.props;
        if (!EVICourse || !EVICourse.current) {
            console.log(EVICourse);
            return;
        }

        const _currProps = {
            sectionList: EVICourse.current.state.sectionList,
            staffPermit: EVICourse.current.state.staffPermit,
            $$course: EVICourse.current,
            course: EVICourse.current.state.course,
            noBackground : !!noBackground
        };
        _currProps['isMore'] = EVICourse.current.isMore();
        _currProps['isLoading'] = EVICourse.current.isLoading();

        if (!!this.$$init && (Object.keys(_currProps).map(_key => prevState[_key] === _currProps[_key]).filter(_compare => _compare !== true)).length === 0) {
            return;
        }

        this.setState(_currProps, () => {
            this.$$init = true;
            if (!prevState.staffPermit.get_list && this.state.staffPermit.get_list && this.state.classList.length === 0) {
                this.getClassList();
            }
        });
    }

    componentWillUnmount = async () => {
        this.$$isMount = false;
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
        this.getData();
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
                        URLid={this.state.targetID || this.state.course.id} 
                        type={this.state.uploadingFileType}
                        onCancel={() => { if(!!this.$$isMount) { this.uploadingDone()}} }
                        />
                </Modal>
                );
    }

    ShowUploading = (type = []) => {
        this.setUploadingFile(true, type);
    }

    getData = async(i_reset = true) => {
        return this.state.$$course.getData(i_reset);
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
        await course.getFullInfo(item.ref_id).then(ret => {
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

        if (!!this.$$isMount) {
            this.setState({
                targetID : item.ref_id,
                type: 'file'
            },
            () => {this.ShowUploading('file')});
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
    getClassList = async () => {
        let gList = await school.getClassTree();
        if (!!this.$$isMount) {
            this.setState({classList: gList});
        }
    }

    onSelect = (i_select) => {
        this.state.$$course.setFilter(i_select);
    }

    render() {
        if (!this.$$init)
            return (null);

        const styleCss = {
            courseList: {
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                minHeight: "200px"
            },
            background: {
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: `url(${!!this.state.course ? this.state.course.background : null })`,
                minHeight: "calc(100vh - 147px)"
            },
            button: {
                background: "#2b4b80",
                color: "#fff",
                width: "100%"
            }
        };

        const Loader = (<div className="loader" key={0} style={{textAlign: "center"}}>Loading ...</div>);
        return (<Row key={"course-item-list"} type="flex" justify="space-around" style={{minHeight: "100vh", ...(!!this.state.noBackground ? {} : styleCss.background)}}>
            {this.createModal(this.props.translations.initDone && intl.get("course_1.content.ModalTitle"))}
            <Col span={24}  style={{maxWidth: "1200px", padding: "0 0rem"}}>
            {this.state.staffPermit.update && (
            <Row type="flex" justify="end" style={{marginBottom: 20, marginTop: 40 , padding : "0 2rem"}}>
                <div className={memu.background_button} onClick={() => this.ShowUploading('background')}><Icon type="camera" />&nbsp;&nbsp;{this.props.translations.initDone && intl.get("course_1.content.edit.background")}</div>
                <Col xl={8} lg={11} sm={{span: 22 , offset : 2}} xs={24}>
                <Row>
                    <Col span={8} style={{textAlign: 'center'}}>
                    <TreeSelect
                        treeData={this.state.classList}
                        treeCheckable={true}
                        placeholder={this.props.translations.initDone && intl.get("course_1.content.option.grade")}
                        allowClear={true}
                        showCheckedStrategy={SHOW_PARENT}
                        onChange={this.onSelect}
                        style={{width: "100%"}}
                        />
                    </Col>
                    <Col span={8} style={{textAlign: 'center'}}>
                    <LandingPopup
                        ref="LandingPopup"
                        title={this.props.translations.initDone && intl.get("course_1.content.option.studentEdit")}
                        titleModal={this.props.translations.initDone && intl.get("course_1.content.option.studentEdit")}
                        type={"studentedit"}
                        width={930}
                        className={"manageModal"}
                        style={styleCss.button}
                        />
                    </Col>
                    <Col span={8} style={{textAlign: 'center'}}>
                    <Button style={styleCss.button} onClick={this.showAddCourse} > {this.props.translations.initDone && intl.get("course_1.content.option.calssAdd")}
                    </Button>
                    </Col>
                </Row>
                <CourseEditor
                    onRef={this.onRef}
                    URLid={this.state.course.id}
                    refresh={() => {
                                    this.getData();
                                }}
                    />
                </Col>
            </Row>)}
            <Skeleton loading={!!this.state.isLoading} active paragraph={{rows: 12}} />
            <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loader={Loader}
                loadMore={ () => {
                        this.state.$$course.setOffset((this.state.$$course.state.offset + 1));
                            }}
                hasMore={ !!this.state.isMore }
                >
                {this.state.sectionList.map((section, index) => {
                        return (
                                <React.Fragment  key={section.section_id || index}>
                                    <Row type="flex" justify="space-between" style={{marginBottom: 20, marginTop: 25}}>
                                        <Col xl={5}>
                                        <h1 style={{color: "#2b4b80", fontWeight: 600, margin: 0}}>
                                            {section.section_name}
                                        </h1>
                                        </Col>
                                    </Row>
                                    <Row type="flex" justify="center" align="middle" gutter={8} style={{marginLeft: 0, marginRight: 0}}>  
                                        {section.data.map((item, index) => {
                                        return (
                                                                <Col xs={12} md={6} lg={6} xl={4}
                                                                     className={memu.item} 
                                                                     key={index}
                                                                     style={{padding: "0.45rem", marginBottom: "1rem"}}
                                                                     >
                                                                <Adapter item={item} info={true}>
                                                                    {this.state.staffPermit.update && item.type === "COURSE" &&
                                                                                                    <div className={memu.warp}  style={{top: "0.45rem", right: "0.45rem"}}>
                                                                                                        <div className={`${memu.set} ${memu.btn}`} onClick={this.handleMemuSet.bind(this, item)} > <Icon type="setting" /> </div>
                                                                                                        <div className={`${memu.camera} ${memu.btn}`} onClick={this.handleCamera.bind(this, item)} > <Icon type="camera" /> </div>
                                                                                                    </div>
                                                                    }  
                                                                    <Memulist
                                                                        multi={true}
                                                                        index={index}
                                                                        picUrl={item.file}
                                                                        title={item.name}
                                                                        titleRadius={"0 0 20px 20px"}
                                                                        titlePadding={"0 0 0 20px"}
                                                                        borderRadius={"20px"}
                                                                        height={"100%"}
                                                                        />
                                                                </Adapter>
                                                                </Col>
                                                        );
                                            })}
                                    </Row>
                                </React.Fragment>
                                );
                    })}
            </InfiniteScroll>
            </Col>
            <Col span={24}>
            <ManagePopup
                title={this.props.translations.initDone && intl.get("course_1.tabs.data")}
                width={930}
                visible={this.state.visible}
                onCancel={this.onCancel}
                >
                <div className="card-container">
                    <Tabs
                        type="card"
                        activeKey={this.state.activeKey}
                        tabBarStyle={{padding: "0 20px"}}
                        >
                        <TabPane
                            tab={this.props.translations.initDone && intl.get("course_1.tabs.data")}
                            key="a"
                            disabled={!this.state.disabled}
                            style={{padding: 0}}
                            >
                            <CourseData
                                keyword={this.state.updateData.name || ""}
                                data={this.state.updateItem}
                                updateData={this.state.updateData}
                                treeData={this.state.classList}
                                URLid={this.state.course.id}
                                sendFormData={(item, data) => {
                        this.getFormData(item, data);
                    }}
                                nextStep={() => {
                        this.nextStep();
                    }}
                                />
                        </TabPane>
                        <TabPane
                            tab={this.props.translations.initDone && intl.get("course_1.tabs.sort")}
                            key="b"
                            disabled={this.state.disabled}
                            >
                            <CourseSort
                                data={this.state.sortData}
                                formData={this.state.formData}
                                onCancel={() => {
                        this.sortCancel();
                    }}
                                closePopup={() => {
                        this.onCancel();
                    }}
                                refresh={() => {
                        this.getData();
                    }}
                                />
                        </TabPane>
                    </Tabs>
                </div>
            </ManagePopup>
            </Col>
        </Row>);
    }
    ;
}

function mapStateToProps( { route, user, translations }) {
    return {
        route,
        user,
        translations
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateFileName: payload => dispatch({type: "updateFileName", payload}),
    };
}

export default connect(
        mapStateToProps,
        mapDispatchToProps
        )(CourseList);
