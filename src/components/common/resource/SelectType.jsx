import React, { Component } from "react";
import {  Checkbox , Tag } from "antd";
import { connect } from "react-redux";
// import intl from "react-intl-universal";

class selectType extends Component {

    $$defaultOpt = [
        {label: "課件", value: "jttw,jttw360,learn", is_select: false},
        {label: "圖片", value: "img_real,img_cartoon,img_line_graph", is_select: false},
        {label: "MC題", value: "mc", is_select: false},
        {label: "工作紙", value: "document", is_select: false},
        {label: "探索小活動", value: "project", is_select: false}
    ];

    constructor(props) {
        super(props);
        this.state = {
            selected : this.props.default || ["jttw,jttw360,learn"]
        };
    }
    
    callback = (ret) => {
      console.log(ret);
      let itemList = [].concat(...(ret.map(_item => {
          return _item.split(",");
      })));
      this.setState({selected : ret});
      return typeof this.props.callback === "function" ? this.props.callback(itemList) : itemList;
    }
    
    tagCallback = (tag , checked) => {
        let _idx = this.state.selected.indexOf(tag.value);
        let _select = this.state.selected;
        (_idx > -1 ? _select.splice(_idx , 1) : _select.push(tag.value));
        console.log(_select);
        this.callback(_select);
    }

    render = () => {
        const { CheckableTag } = Tag;

        return !!this.props.tagMode ? 
            (<div style={{margin : "0.8rem auto"}}>
                {this.$$defaultOpt.map(tag => (
                <CheckableTag
                    key={tag.value}
                    checked={this.state.selected.indexOf(tag.value) > -1}
                    onChange={checked => this.tagCallback(tag , checked)}
                    style={{font:"14px" , padding:"2px 7px"}}
                >{tag.label}</CheckableTag>
                ))}
            </div>) : 
            (<Checkbox.Group
            options={this.$$defaultOpt}
            value={this.state.selected || []}
            onChange={this.callback}
            />);
    }
    
}

function mapStateToProps({ route, user, translations }) {
  return {
    route,
    user,
    translations
  };
}

export default connect(mapStateToProps)(selectType);