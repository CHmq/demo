import React, { Component } from "react";
import { connect } from "react-redux";

import courseItem from "components/services/courseItemService";
import course from "components/services/courseService";
import staff from "components/services/staffService";


/**
 *
 * @export Course Tepmlate interface
 * @class CourseTemplate
 * @extends {Component}
 */
class CourseTemplate extends Component {

    $$isMount = false;

    state = {
        course: {
            id: null,
            school_id: null
        },
        sectionList: [],
        selectList : [],
        rest: {
            style: null
        },
        staffPermit : {
            add: false,
            delete: false,
            get: false,
            get_list: false,
            update: false
        },

        $$loading: false,
        offset: 0,
        limit: 20,
        result: [],
        total: 0
    };

    constructor(props) {
        super(props);
    }

    componentDidMount = async() => {
        this.$$isMount = true;
        if (!this.$$isMount) {
            return;
        }
        
        const {route, user, dispatch, children, courseID, staffPermitCallback, userPermitCallback, getInfo, getList, getSectionList, ...rest} = this.props;

        this._staffPermitCallback = staffPermitCallback || this._staffPermitCallback;
        this._userPermitCallback = userPermitCallback || this._userPermitCallback;
        this._getCallback = getInfo || this._getCallback;
        this._getListCallback = getList || this._getListCallback;
        this._getSectionListCallback = getSectionList || this._getSectionListCallback;


        if (!!this.$$isMount) {
            this._getStaffPermit();
            this.setState({userPermit: {get_list: true}}, () => {
                if (this.state.userPermit.get_list) {
                    this.getData();
                }
                typeof this._userPermitCallback === "function" && this._userPermitCallback(this.state.userPermit);
            });
        }

        if (!!this.$$isMount) {
            this.setState({rest});
        }
    }

    componentWillUnmount = async () => {
        this.$$isMount = false;
    }

    isLoading = () => {
        return !!this.state.$$loading && this.state.result.length === 0;
    }
    
    isMore = () => {
        return ((this.state.offset + 1) * this.state.limit < this.state.total);
    }

    _getStaffPermit = () => {
        let _permit = !this.state.course.school_id ? this.state.staffPermit : staff.getResourcePermit(this.state.course.school_id);
        if (_permit !== this.state.staffPermit && !!this.$$isMount) {
            this.setState({staffPermit: _permit}, () => {
                typeof this._staffPermitCallback === "function" && this._staffPermitCallback(this.state.staffPermit);
            });
        }
    }

    _getCallback = (info = {}) => {
        console.log(info);
    }
    _getListCallback = (list = []) => {
        console.log(list);
    }
    _getSectionListCallback = (sectionList = []) => {
        console.log(sectionList);
    }
    _staffPermitCallback = (permit) => {
        console.log(permit);
    }
    _userPermitCallback = (permit) => {
        console.log(permit);
    }
    
    getSectionList = () => {
        return this.state.sectionList;
    }
    
    setList = (ret, i_set = true) => {
        let $$list = Object.values(ret.reduce((_list, { section_id, section_name, ...rest }) => {
            if (!_list[section_id])
                _list[section_id] = {
                    section_id,
                    section_name,
                    data: []
                };
            _list[section_id]['data'].push({section_id, section_name, ...rest});
            return _list;
        }, {}));
        if (!!i_set && !!this.$$isMount) {
            this.setState({sectionList: $$list}, () => {
                this._getSectionListCallback(this.state.sectionList);
            });
        }
        return $$list;
    }

    get = async(i_reset = true, _callback = () => {}) => {
        let _call = course.get(this.props.courseID).catch(_err => {
            console.log(_err);
            if (typeof window !== 'undefined') {
                window.location.href = this.props.route.locationUrl;
            }
            return null;
        }).then(ret => {
            if (!!this.$$isMount && this.state.$$loading === _call) {
                this.setState({
                    course: ret,
                    $$loading: false
                }, () => {
                    this._getStaffPermit();
                    if (!!ret) {
                        _callback(ret);
                        this.getList(i_reset);
                        this._getCallback(ret);
                    }
                });
            }
        });
        if (!!this.$$isMount) {
            this.setState({
                $$loading: _call
            });
        }
        return _call;
    }

    getList = async(i_reset = true) => {
        let _call = courseItem.get_list(this.state.course.id, this.state.selectList, this.state.offset * this.state.limit, this.state.limit).catch(_err => {
            console.log(_err);
            return {total: 0, rows: []};
        }).then(({total, rows}) => {
            let _ret = (!i_reset ? this.state.result : []).concat(rows);
            if (!!this.$$isMount && this.state.$$loading === _call) {
                this.setState({
                    total: total,
                    result: _ret,
                    $$loading: false
                }, () => {
                    this.setList(this.state.result);
                    this._getListCallback({total, rows});
                });
            }
            return _ret;
        });
        if (!!this.$$isMount) {
            this.setState({
                $$loading: _call
            });
        }
        return _call;
    }

    getData = async(i_reset = true) => {
        if (!!i_reset && !!this.$$isMount) {
            this.setState({offset: 0, result: [], sectionList: []}, () => {
                this.getData(false);
            });
            return;
        }
        return this.get(i_reset);
    }

    setOffset = (_offset, i_refresh = true) => {
        this.setState({offset: (_offset)}, () => {
            if (!!i_refresh) {
                this.getList(false);
            }
        });
    }
    
    setFilter = (i_select = []) => {
        this.setState({selectList: i_select}, this.getList);
    }

    render() {
        const rest = !!this.$$isMount ? {...this.state.rest} : {};
        return (
                <div {...rest} >
                    {this.props.children}
                </div>
                );
    }
}


function mapStateToProps( { route, user, translations }) {
    return { route, user, translations};
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(CourseTemplate);