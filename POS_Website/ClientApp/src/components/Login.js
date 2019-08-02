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
import logo from "../assets/images/logo.png";

const { Option } = Select;

// const

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values).then(res => {
          if (res.resuilt === 1) {
            console.log(res);
            message.success("Login Success!");
            sessionStorage.setItem("posUser", res.posUser);
            sessionStorage.setItem("rvcNo", values.rvcNo);
            this.props.setPOSInfo(res.posUser, values.rvcNo);
            window.location.replace("/");
          } else {
            message.error("RVC No or Password is not correct!");
          }
        });
        // console.log("Received values of form: ", values);
      }
    });
  };

  componentDidMount() {
    this.props.requestDefRVCList();
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
      this.openNotification(message, description);
    }
    this.props.requestNotis();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { defRVCList, isLoading } = this.props;
    // console.log(defRVCList);
    return (
      <div className="login-page">
        {isLoading ? (
          <h3>Loading</h3>
        ) : (
          <Row type="flex" justify="center">
            <Dropdown trigger={["click"]} overlay={() => this.menu()}>
              <Button
                className="noti-btn"
                size="large"
                shape="circle-outline"
                type="danger"
                icon="bell"
              />
            </Dropdown>

            <Col lg={10} md={12} sm={16} xs={22} className="login-card">
              <div className="login-form">
                <div>
                  <img style={{ height: "100px" }} alt="logo" src={logo} />
                </div>
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <Form.Item>
                    {getFieldDecorator("rvcNo", {
                      rules: [
                        {
                          required: true,
                          message: "Please choose RVC!"
                        }
                      ]
                    })(
                      <Radio.Group size="large">
                        {defRVCList &&
                          defRVCList.map(item => (
                            <Radio.Button value={item.rvcno}>
                              {item.rvcname}
                            </Radio.Button>
                          ))}
                      </Radio.Group>
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your Password!"
                        }
                      ]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="lock"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        type="password"
                        placeholder="Password"
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                    >
                      Log in
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </Row>
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
