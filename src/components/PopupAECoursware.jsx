import React, { Component } from "react";
import moment from 'moment';
import { Form, Input, Button, Icon, message, Select, Upload, DatePicker, Radio } from "antd";
import { connect } from "react-redux";
import intl from "react-intl-universal";
import styleCss from 'assets/css/PopupAddCoursware.module.scss'
import ManagePopup from "components/common/ManagePopup";
import main from "./services/mainService";

let TITLE = ''; //'新加' || 'New plus'

/**
 * @description A新加 or E编辑 课件
 * 
 */
class PopupAddCoursware extends Component {

    $$mount = false;

    state = {
        resourceID: null,
        type: null,

        title: TITLE, // 标题
        visible: false, // 显示与隐藏弹框
        Grade: [], // 年级 多选
        GradeOPTIONS: ['PN', 'K1', 'K2', 'K3'],
        // checkOptions: [
        //   // { label: 'MC题', value: 'mc' },
        //   { label: '工作紙', value: 'document' },
        //   { label: '探索小活動', value: 'project' },
        // ],
        checkValue: [],
        checkvalue: [], // 选中checkOptions的value
        fileList: [], // 图片上传 
        fileShow: true, // 图片上传按钮显示与隐藏 true 为显示
        IMGtype: false, // 图片上传按钮显示与隐藏 当删除图片时候给true true 为显示
        fileType: '', // 图片文件上传的格式
        children: [], // 随意输入
        value: 1, // 单选框
        startValue: null, // 開始時間
        endValue: null, // 結束時間
        editorId: null, // 编辑iD
        form: {
            type: "project",
            name: "",
            status: "VALID",
            grade: [],
            file: '',
            publish_time: null,
            // Upload:value.field,
            end_time: null,
            teaching_point: "",
            tags: []// 数组类型
        }
    };
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.$$mount = true;
        this.props.onOpend(this);
    }

    componentWillUnmount = () => {
        this.$$mount = false;
    }

    _onChange = (field, value) => {
        this.setState({
            [field]: value
        });
    }

    // 单选框
    onChange = e => {
//        this.setState({
//            value: e.target.value
//        });
        this._onChange('value', e.target.value);
    }

    //关闭对话框
    onCancel = () => {
        this._onChange('visible', false);
        this._onChange('startValue', null);
        this._onChange('endValue', null);
        this.Re();
    }

    // 打开对话框 (value是编辑传过来的数据)
    onOpend = (course, title = TITLE) => {
        let id = !!course ? course.id : null;
        if (!!id) {
            this.getValue(id);
        }
        if (!!this.$$mount) {
            this.setState({
                visible: true,
                title: title,
                editorId: id
            });
        }
    }
    // 请求获取编辑详细内容
    getValue = async (id) => {
        return main.getClass(id).then(this.result).catch(err => {
            console.log(err);
        });
    }

    result = (value) => {
        value.file === null ? this.setState({
            fileShow: true
        }) : this.setState({
            fileShow: false
        });
        // console.log('加载判断')
        this.setState({
            startValue: moment(value.publish_time, 'YYYY-MM-DD HH:mm'),
            endValue: value.end_time === null ? null : moment(value.end_time, 'YYYY-MM-DD HH:mm')// 結束時間
        });

        const {setFieldsValue} = this.props.form;
        this.setState({
            form: {
                type: value.type,
                name: value.name,
                status: "VALID",
                grade: value.grade_type === null ? [] : value.grade_type, // 数组类型
                file: (value.type === "document" ? value.file === null ? '' : [
                    {
                        uid: '-1',
                        status: 'done',
                        thumbUrl: value.file
                    }
                ] : undefined),
                publish_time: moment(value.publish_time, 'YYYY-MM-DD HH:mm'),
                // Upload:value.field,
                end_time: value.end_time === null ? null : moment(value.end_time, 'YYYY-MM-DD HH:mm'),
                teaching_point: value.teaching_point,
                tags: value.tags === null ? [] : value.tags // 数组类型
            }
        }, () => {
            setFieldsValue(this.state.form);
        });
//        return setFieldsValue();
    }

    //按钮点击 提交事件
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            if (!!err) {
                return;
            }

            values.file = values.file ? ( values.file.length === 0 ? "" : values.file["0"].thumbUrl.split(`data:${this.state.fileType};base64,`)[1]) : ("");
            // values.merchant_id = 302 // 目前写死状态这个id
            values.status = "VALID";
            values.tags = values.tags ? values.tags.join() : "";
            values.grade = values.grade ? values.grade.join() : "";
            values.publish_time = values.publish_time ? values.publish_time.format('YYYY-MM-DD HH:mm') : '';
            values.end_time = values.end_time ? values.end_time.format('YYYY-MM-DD HH:mm') : '';
            // 信息正確填寫處理
            if (!this.state.editorId) {
                this._add(values); // 请求添加数据 api
            } else {
                this._editor(values); // 编辑数据 api
            }
        });
    }

    // 添加事件
    async _add(values) {
        await main.addClass(values).then(ret => {
            message.success("添加成功");
            console.log(ret);
            if(typeof this.props.addCallback === "function") {
                this.props.addCallback();
            }
//            this.props.getSearch(); // 更新父组件的数据 api
            this.onCancel();// 关闭弹框
        }).catch(_msg => {
            message.error('error');
            console.log(_msg);
        });
    }

    // 编辑事件
    async _editor(value) {
        value.id = this.state.editorId;
        await main.updateClass(value).then(item => {
            message.success("编辑成功");
            console.log(item);
            if(typeof this.props.updateCallback === "function") {
                this.props.updateCallback();
            }
//            this.props.getSearch(); // 更新父组件的数据 api
            this.onCancel();// 关闭弹框
        }).catch(_msg => {
            message.error('error');
            console.log(_msg);
        });
    }

    // 提交驗證
    vaIidate = () => {
        const {getFieldsError, getFieldsValue} = this.props.form;
        const value = getFieldsValue(["type", "status", "name", "grade", "publish_time", "Upload", "end_time", "teaching_point", "tags"]);
        const error = getFieldsError(["type", "status", "name", "grade", "publish_time", "Upload", "end_time", "teaching_point", "tags"]);
        return error.type ||
//                error.status ||
                error.name ||
                error.grade ||
                error.publish_time ||
                !value.type ||
//                !value.status ||
                !value.name ||
                !value.grade ||
                !value.publish_time
                ? true
                : false;
    }

    // 图片上傳 or 删除都会触发
    normFile = e => {
        let type = e.file.type;
        // 图片上传格式
        if (type === 'image/png' || type === 'image/jpeg' || type === 'image/gif' || this.state.IMGtype === true) {
            if (this.state.fileShow === true) {
                this.setState({
                    fileType: e.fileList.length === 0 ? "" : e.fileList['0'].type,
                    IMGtype: false
                });
                console.log('图片上传');
            }
        } else {
            this.setState({
                fileList: "",
                fileShow: true
            });
            message.error('你的上傳文件格式不符合!');
            return false;
        }
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    // 多选下拉
    GradehandleChange = Grade => {
        this.setState({Grade});
    }
    // 日期 选择（发布日期、结束日期 start）
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return startValue && startValue < moment().startOf('day')
        }
        return startValue.valueOf() > endValue.valueOf() || startValue < moment().startOf('day');
    }
    onStartChange = (current) => {
        this._onChange('startValue', current);
    }

    onEndChange = (current) => {
        this._onChange('endValue', current);
    }
    disabledEndDate = endValue => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return endValue && endValue < moment().startOf('day');
        }
        return endValue.valueOf() <= startValue.valueOf() || endValue < moment().startOf('day');
    }
    // 日期 选择（发布日期、结束日期 end）
    // 重置表单(清空)
    Re = e => {
        this.setState({
            fileShow: true
                    // IMGtype:true
        }, () => {
            this.props.form.resetFields();
        });
    }

    render() {
        const {Grade, GradeOPTIONS, title} = this.state;
        const {translations} = this.props;
        const GradeOptions = GradeOPTIONS.filter(o => !Grade.includes(o));
        // 樣式自適應
        const formItemLayout = {
            labelCol: {
                xs: {span: 22},
                sm: {span: 6}
            },
            wrapperCol: {
                xs: {span: 22},
                sm: {span: 15}
            }
        };
        const {getFieldDecorator} = this.props.form;

        // 图片上传
        const props = {
            listType: 'picture',
            accept: ".png,.jpg,.gif",
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                        IMGtype: true
                    };
                });
            },
            onChange: file => {
                // 监听图片上传按钮显示与隐藏
                if (file.fileList.length === 0) {
                    this.setState({
                        fileShow: true
                    });
                } else {
                    this.setState({
                        fileShow: false
                    });
                }
            },
            beforeUpload: file => {
                this.setState(state => ({
                        fileList: [...state.fileList, file]
                    }));
                return false;
            }
            // defaultFileList:[...fileList]
        };
        // 多语言
        const _fn = function (value) {
            return translations.initDone && intl.get('course_1.content.PopupAECoursware.'+value);
        };
        const Language = {
            File: _fn("File"),
            FileSupport: _fn("FileSupport"),
            Type: _fn("Type"),
            State: _fn("State"),
            Name: _fn("Name"),
            Coverimg: _fn("Coverimg"),
            Coverimgbtn: _fn("Coverimgbtn"),
            CoverimgSupport: _fn("CoverimgSupport"),
            Grade: _fn("Grade"),
            Releasetime: _fn("Releasetime"),
            Endtime: _fn("Endtime"),
            Teachingfocus: _fn("Teachingfocus"),
            Keywords: _fn("Keywords"),
            TITLE: _fn("TITLE"),
            btnadd: _fn("btnadd"),
            btnsure: _fn("btnsure"),
            Radiodocument: _fn("Radiodocument"),
            Radioproject: _fn("Radioproject"),
            SelectEffective: _fn("SelectEffective"),
            SelectInvalid: _fn("SelectInvalid"),
            rulesType: _fn("rulesType"),
            rulesStatus: _fn("rulesStatus"),
            rulesName: _fn("rulesName"),
            rulesGrade: _fn("rulesGrade"),
            rulesReleasetime: _fn("rulesReleasetime")
        };
        TITLE = Language.TITLE;
        
        const { type : btnType , shape : btnShape , icon : btnIcon , text : btnText
        //{Language.TITLE}
        } = this.props
        
        return (
                    <React.Fragment>
                    <Button type={btnType || "primary"} shape={btnShape || "circle"} icon={btnIcon || "plus"} onClick={this.onOpend}>{btnShape !== "circle" ? btnText : "" }</Button> 
                    <ManagePopup title={title} width={'500'} onCancel={this.onCancel} visible={this.state.visible}>
                        <Form
                            {...formItemLayout}
                            onSubmit={this.handleSubmit}
                            className={`login-form ${styleCss.warp}`}
                            >
                            <Form.Item label={Language.Type}>
                                {getFieldDecorator("type", {
                                            rules: [{required: true, message: `${Language.rulesType}`}],
                                            initialValue: this.state.form.type
                                })
                                (<Radio.Group onChange={() => this.onChange} disabled={!!this.state.editorId}>
                                        {false && (<Radio value={'document'}>{Language.Radiodocument}</Radio>)}
                                        <Radio value={'project'}>{Language.Radioproject}</Radio>
                                 </Radio.Group>)
                                // (<Radio.Group options={this.state.checkOptions} onChange={this.onChange.bind(this)} />)
                                }
                            </Form.Item>
                            <Form.Item label={Language.Name}>
                                {getFieldDecorator("name", {
                            rules: [{required: true, message: `${Language.rulesName}`}]
                        })(<Input placeholder="" />)}
                            </Form.Item>
                            {this.props.form.getFieldValue("type") === "document" && (
                                                        <Form.Item label={Language.File} extra={Language.FileSupport + ' ( .pdf , .png , .jpg )'}>
                                                        {getFieldDecorator('file', {
                                                                                        valuePropName: 'fileList',
                                                                        getValueFromEvent: this.normFile
                                                                    })(<Upload {...props}>{this.state.fileShow === true ? (<Button><Icon type="upload" /> {Language.Coverimgbtn}</Button>) : null}</Upload>)}
                                                    </Form.Item>)}
                            <Form.Item label={Language.Grade}>
                                {getFieldDecorator('grade', {
                            rules: [{required: true, message: `${Language.rulesGrade}`}]
                        })(
                                        <Select
                                            mode="multiple"
                                            placeholder=""
                                            onChange={this.GradehandleChange}
                                            style={{width: '100%'}}
                                            >
                                            {GradeOptions.map(item => (
                                                                    <Select.Option key={item} value={item}>
                                                                        {item}
                                                                    </Select.Option>
                                                                        ))}
                                        </Select>
                                )
                                }
                            </Form.Item>
                            <Form.Item label={Language.Releasetime}>
                                {getFieldDecorator('publish_time', {
                            rules: [{required: true, message: `${Language.rulesReleasetime}`}]
                        })(
                                        <DatePicker
                                            disabledDate={this.disabledStartDate}
                                            style={{width: '100%'}}
                                            placeholder=""
                                            format="YYYY-MM-DD HH:mm"
                                            onChange={this.onStartChange}
                                            />,
                                )}
                            </Form.Item>
                            {false && (<Form.Item label={Language.Endtime}>
                                {getFieldDecorator("end_time")(<DatePicker
                                    format="YYYY-MM-DD HH:mm"
                                    style={{width: '100%'}}
                                    placeholder={""}
                                    onChange={this.onEndChange}
                                    disabledDate={this.disabledEndDate}
                                    ></DatePicker>)}
                            </Form.Item>)}
                            <Form.Item label={Language.Teachingfocus}>
                                {getFieldDecorator("teaching_point")(<Input placeholder="" />)}
                            </Form.Item>
                            <Form.Item label={Language.Keywords}>
                                {getFieldDecorator("tags")(
                                        <Select mode="tags"
                                                style={{width: '100%'}}
                                                placeholder={""}
                                                tokenSeparators={[',']}
                                                >
                                            {this.state.children}
                                        </Select>
                                )}
                            </Form.Item>
                            <div>
                                <Button
                                    type="primary"
                                    style={{width: "100%"}}
                                    htmlType="submit"
                                    disabled={this.vaIidate()}
                                    >
                                    {this.state.title === TITLE ? Language.btnadd : Language.btnsure}
                                </Button>
                            </div>
                        </Form>
                    </ManagePopup>
                </React.Fragment>
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

export default connect(mapStateToProps)(Form.create()(PopupAddCoursware));
