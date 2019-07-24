import React, { Component } from 'react';
import {Icon} from "antd";
import styleCss from 'assets/css/Memulistwarp.module.scss';

import staff from "components/services/staffService";

/**
 * 属于 Memulist 组件的外壳
 * 目前只有编辑的状态
 **/
class Memulistwarp extends Component {

    $$mount = false;

    state = {
        edit: false
    };

    constructor(props) {
        super(props);
        this.updatePermit();
    }

    componentDidMount = async() => {
        this.$$mount = true;
        this.updatePermit();
    }

    componentWillUnmount = async() => {
        this.$$mount = false;
    }

    updatePermit = () => {
        const {type, school_id} = this.props.item;
        let permitUpdate = ['document', 'project', 'mc'].indexOf(type) > -1 && staff.checkRPermit({module: 'resource', ctrl: 'main', action: 'update'}) && staff.checkMerchant(school_id);
        if (this.$$mount) {
            this.setState({edit: permitUpdate});
        }
    }

    editDom = () => {
        (typeof this.props.open === "function") ? this.props.open() : void(0);
    }

    render() {
        const {edit} = this.state;
        const actons = {
            true: '', // 默认显示
            false: 'none'// false 就隐藏
        };

        return (
                <div className={styleCss.warp} style={{color: 'red'}}>
                    {!!edit ? (<div className={`${styleCss.edit} ${styleCss.ab}`} style={{display: `${actons[edit]}`}}><Icon type="edit" onClick={this.editDom} /> </div>) : null }
                    <div>{this.props.children}</div>
                </div>
                );
    }
}

export default Memulistwarp;