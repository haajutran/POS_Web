import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../store/Login";
import {
  Form,
  Icon,
  Input,
  Button,
  Select,
  Row,
  Col,
  message,
  Radio,
  notification,
  Menu,
  Dropdown,
  Modal
} from "antd";
import logo from "../assets/images/logo2.png";
import moment from "moment";

const { Option } = Select;

// const

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedRVCNo: "",
      password: ""
    };
  }

  menu = () => {
    const { notis } = this.props;
    return (
      <Menu>
        {notis &&
          notis.map(item => (
            <Menu.Item key={item.id} onClick={() => this.info(item)}>
              {item.title}
            </Menu.Item>
          ))}
      </Menu>
    );
  };

  info = item => {
    Modal.info({
      title: item.title,
      content: (
        <div>
          <p>{item.information}</p>
        </div>
      ),
      onOk() {}
    });
  };

  openNotification = (message, description) => {
    const args = {
      message,
      description,
      duration: 0,
      placement: "topLeft"
    };
    notification.open(args);
  };

  handleSubmit = () => {
    const { checkedRVCNo, password } = this.state;
    if (checkedRVCNo.length === 0 || password.length === 0) {
      message.warning("Please choose the RVCNo and input your password!");
      return;
    }
    const data = {
      rvcNo: checkedRVCNo,
      password
    };
    this.props.login(data).then(res => {
      if (res.resuilt === 1) {
        // console.log(res);
        message.success("Login Success!");
        sessionStorage.setItem("posUser", res.posUser);
        sessionStorage.setItem("rvcNo", checkedRVCNo);
        this.props.setPOSInfo(res.posUser, checkedRVCNo);
        window.location.replace("/");
      } else {
        message.error("RVC No or Password is not correct!");
      }
    });
    // console.log("Received values of form: ", values);
  };

  async componentDidMount() {
    await this.props.requestDefRVCList();
    if (this.props.defRVCList.length > 0) {
      const checkedRVCNo = this.props.defRVCList[0].rvcno;
      this.setState({
        checkedRVCNo
      });
    }

    this.checkNotis();
  }

  checkNotis = async () => {
    const totalNotis = await this.props.getTotalNotis();
    console.log(totalNotis);
    if (totalNotis.totalMessage === 1) {
      const noti = await this.props.getNoti(totalNotis.idAlert);
      console.log(noti);
      const message = noti.title;
      const description = noti.information;
      // this.openNotification(message, description);
    }
    this.props.requestNotis();
  };

  checkRVCNo = async rvcNo => {
    this.setState({
      checkedRVCNo: rvcNo
    });
  };

  press = number => {
    const { checkedRVCNo, password } = this.state;
    if (checkedRVCNo.length === 0) {
      message.warn("Please choose the RVCNo first!");
      return;
    }
    const res = password + number + "";
    console.log(res);
    this.setState({
      password: res
    });
  };
  pressClear = () => {
    this.setState({
      password: ""
    });
  };
  handleChangePassword = e => {
    this.setState({
      password: e.target.value
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { defRVCList, isLoading } = this.props;
    const { checkedRVCNo, password } = this.state;
    console.log(checkedRVCNo.length);
    // console.log(defRVCList);
    return (
      <div className="login-page">
        {isLoading ? (
          <h3>Loading</h3>
        ) : (
          <div>
            <Row>
              <Col xl={14}>
                <div className="lp lp-l">
                  <div className="logo">
                    <img alt="logo" src={logo} />
                  </div>
                  <div className="content">
                    <div className="top">
                      <div className="lpct-btn">
                        <Icon className="icon" type="import" />
                        <p>Check In</p>
                      </div>
                      <div className="lpct-btn">
                        <Icon className="icon" type="export" />
                        <p>Check Out</p>
                      </div>
                      <div className="lpct-info">
                        <p className="time">
                          {moment(new Date())
                            .format("HH:mm")
                            .toString()}
                        </p>
                        <p className="date">
                          {moment(new Date())
                            .format("dddd")
                            .toString()}
                        </p>
                        <p className="date">
                          {moment(new Date())
                            .format("MMMM DD, YYYY")
                            .toString("")}
                        </p>
                      </div>
                    </div>
                    <div className="btns">
                      <Row gutter={32}>
                        {defRVCList &&
                          defRVCList.map(item => (
                            <Col xl={12}>
                              <div className="btn">
                                <div
                                  className={`btn-wrapper ${checkedRVCNo ===
                                    item.rvcno && "checked"}`}
                                  onClick={() => this.checkRVCNo(item.rvcno)}
                                >
                                  <span>{item.rvcname}</span>
                                </div>
                              </div>
                            </Col>
                          ))}
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xl={10}>
                <div className="lp lp-r">
                  <div className="login-zone">
                    <p className="fl">Please input your password to login</p>
                    <div onSubmit={this.handleSubmit} className="login-form">
                      <Input
                        prefix={
                          <Icon
                            type="lock"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        value={password}
                        onChange={this.handleChangePassword}
                        type="password"
                        placeholder="Password"
                        disabled={checkedRVCNo.length === 0 ? true : false}
                      />
                    </div>
                    <div className="keys-input">
                      <div className="row">
                        <div
                          className={`btn ${
                            checkedRVCNo.length === 0 ? "disabled" : "active"
                          }`}
                          onClick={() => this.press(7)}
                        >
                          7
                        </div>
                        <div
                          className={`btn ${
                            checkedRVCNo.length === 0 ? "disabled" : "active"
                          }`}
                          onClick={() => this.press(8)}
                        >
                          8
                        </div>
                        <div
                          className={`btn ${
                            checkedRVCNo.length === 0 ? "disabled" : "active"
                          }`}
                          onClick={() => this.press(9)}
                        >
                          9
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className={`btn ${
                            checkedRVCNo.length === 0 ? "disabled" : "active"
                          }`}
                          onClick={() => this.press(4)}
                        >
                          4
                        </div>
                        <div
                          className={`btn ${
                            checkedRVCNo.length === 0 ? "disabled" : "active"
                          }`}
                          onClick={() => this.press(5)}
                        >
                          5
                        </div>
                        <div
                          className={`btn ${
                            checkedRVCNo.length === 0 ? "disabled" : "active"
                          }`}
                          onClick={() => this.press(6)}
                        >
                          6
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className={`btn ${
                            checkedRVCNo.length === 0 ? "disabled" : "active"
                          }`}
                          onClick={() => this.press(1)}
                        >
                          1
                        </div>
                        <div
                          className={`btn ${
                            checkedRVCNo.length === 0 ? "disabled" : "active"
                          }`}
                          onClick={() => this.press(2)}
                        >
                          2
                        </div>
                        <div
                          className={`btn ${
                            checkedRVCNo.length === 0 ? "disabled" : "active"
                          }`}
                          onClick={() => this.press(3)}
                        >
                          3
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className={`btn ${
                            password.length > 0 ? "active" : "disabled"
                          }`}
                          onClick={() => this.pressClear()}
                        >
                          Clear
                        </div>
                        <div
                          className={`btn ${
                            checkedRVCNo.length === 0 ? "disabled" : "active"
                          }`}
                          onClick={() => this.press(0)}
                        >
                          0
                        </div>
                        <div
                          className={`btn ${
                            checkedRVCNo.length === 0 || password.length === 0
                              ? "disabled"
                              : "active"
                          }`}
                          onClick={() => this.handleSubmit()}
                        >
                          Login
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          // <Row type="flex" justify="center">
          //   <Dropdown trigger={["click"]} overlay={() => this.menu()}>
          //     <Button
          //       className="noti-btn"
          //       size="large"
          //       shape="circle-outline"
          //       type="danger"
          //       icon="bell"
          //     />
          //   </Dropdown>

          //   <Col lg={10} md={12} sm={16} xs={22} className="login-card">
          //     <div className="login-form">
          //       <div>
          //         <img style={{ height: "100px" }} alt="logo" src={logo} />
          //       </div>
          //       <Form onSubmit={this.handleSubmit} className="login-form">
          //         <Form.Item>
          //           {getFieldDecorator("rvcNo", {
          //             rules: [
          //               {
          //                 required: true,
          //                 message: "Please choose RVC!"
          //               }
          //             ]
          //           })(
          //             <Radio.Group size="large">
          //               {defRVCList &&
          //                 defRVCList.map(item => (
          //                   <Radio.Button value={item.rvcno}>
          //                     {item.rvcname}
          //                   </Radio.Button>
          //                 ))}
          //             </Radio.Group>
          //           )}
          //         </Form.Item>
          //         <Form.Item>
          //           {getFieldDecorator("password", {
          //             rules: [
          //               {
          //                 required: true,
          //                 message: "Please input your Password!"
          //               }
          //             ]
          //           })(
          //             <Input
          //               prefix={
          //                 <Icon
          //                   type="lock"
          //                   style={{ color: "rgba(0,0,0,.25)" }}
          //                 />
          //               }
          //               type="password"
          //               placeholder="Password"
          //             />
          //           )}
          //         </Form.Item>
          //         <Form.Item>
          //           <Button
          //             type="primary"
          //             htmlType="submit"
          //             className="login-form-button"
          //           >
          //             Log in
          //           </Button>
          //         </Form.Item>
          //       </Form>
          //     </div>
          //   </Col>
          // </Row>
        )}
      </div>
    );
  }
}

const LoginForm = Form.create()(Login);

export default connect(
  state => state.login,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(LoginForm);
