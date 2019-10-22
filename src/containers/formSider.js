import React, { Component } from 'react';
import { Form, Icon, Input, Button, Select } from 'antd';

// import { Container } from './styles';
const { Option } = Select;

class FormSider extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {setMasterState} = this.props;
        console.log('Received values of form: ', values);
        setMasterState(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout =
      {
        labelCol: { span: 14 },
        wrapperCol: { span: 10 },
      }
    return (
        <div style={{backgroundColor: '#49505f', borderRadius: 10, margin: 10, boxShadow: '5px 5px 5px rgba(0,0,0,0.5)'}}>
        <Form onSubmit={this.handleSubmit} className="simulacao-form" style={{padding: 8, }} >
        <Form.Item label="Tipo de Distribuição" style={{marginBottom: 0}}>
        {getFieldDecorator('tipo_distribuicao', {
            initialValue: '1',
          })(
            <Select>
              <Option value="1">Uniforme</Option>
              <Option value="2">Triangular</Option>
              <Option value="3">Exponencial</Option>
              <Option value="4">Normal</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Tempos chegada e Probabilidade" style={{marginBottom: 0}}>
          {getFieldDecorator('distribuicao_chegadas_valor', {
            initialValue: "10,11,12,13,14",
            rules: [{ required: true, message: 'Informe os tempos de chegadas divididos por vírgula ' }]
          })(
            <Input
              prefix={<Icon type="login" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix="Min."
            />,
          )}
        </Form.Item>
        <Form.Item style={{marginBottom: 0}}>
          {getFieldDecorator('distribuicao_chegadas_percentual', {
            initialValue:"15,30,50,90,100",
            rules: [{ required: true, message: 'Informe o Percentual acumulado de propabilidade de ocorrencia dividido por vírgulas' }],
          })(
            <Input
              prefix={<Icon type="login" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix="%"
            />,
          )}
        </Form.Item>
        <Form.Item label="Tempos Atendimento e Probabilidade" style={{marginBottom: 0}}>
          {getFieldDecorator('distribuicao_atendimento_valor', {
            initialValue: "9,11,13,15,17",
            rules: [{ required: true, message: 'Informe os tempos de atendimento divididos por vírgula ' }]
          })(
            <Input
              prefix={<Icon type="logout" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix="Min."
            />,
          )}
        </Form.Item>
        <Form.Item style={{marginBottom: 0}}>
          {getFieldDecorator('distribuicao_atendimento_percentual', {
            initialValue:"10,30,45,80,100",
            rules: [{ required: true, message: 'Informe o Percentual acumulado de propabilidade de ocorrencia dividido por vírgulas' }],
          })(
            <Input
              prefix={<Icon type="logout" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix="%"
            />,
          )}
        </Form.Item>
        <Form.Item label="Tempo Simulação: " style={{marginBottom: 0}} {...formItemLayout}>
          {getFieldDecorator('tempo_simulacao', {
            initialValue:540,
            rules: [{ required: true, message: 'Informe o Tempo de Simulação' }],
          })(
            <Input
              prefix={<Icon type="clock-circle" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix="Min."
            />,
          )}
        </Form.Item>
        {/* TODO Adicionar min - máx - Moda - Média - Variância */}
        <Button type="primary" htmlType="submit" className="simular-form-button">
          Simular
        </Button>
      </Form>
        </div>
    )
  }
}

export const WrappedFormSider = Form.create({ name: 'simulacao-form' })(FormSider);
//TODO - Colocar essa bagaça no redux.