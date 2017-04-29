// @flow
import React from 'react';
import moment from 'moment-timezone';

// Types
export const FormTypes = {
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  DATE: 'DATE',
  TEXTAREA: 'TEXTAREA',
  SWITCH: 'SWITCH',
  SELECT: 'SELECT',
};

export type FormType = $Keys<typeof FormTypes>

export const ValueTypes = {
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATE',
};

export type ValueType = $Keys<typeof ValueTypes>

export type FormObject = {
  type?: FormType,
  label?: string,
  col?: number,
  disabled?: boolean,
  value?: any,
  model?: string,
  visible?: boolean,
  required?: boolean,

  textareaRows?: number,

  selectOptions?: { text: string, value: any }[],
  selectType?: ValueType,
}

// handler
const handleChange = (model: string, callback: Function, valLoc: ValueType = ValueTypes.TEXT) => event => {
  let val;
  switch (valLoc) {
    case ValueTypes.BOOLEAN:
      val = event.target.checked;
      break;
    case ValueTypes.NUMBER:
      val = parseFloat(event.target.value);
      break;
    case ValueTypes.DATE:
      val = new Date(event.target.value);
      break;
    case ValueTypes.TEXT:
    default:
      val = event.target.value;
  }
  if (callback) callback(model, val);
};

const defaultForm = {
  type: FormTypes.TEXT,
  label: '',
  col: 12,
  disabled: false,
  value: '',
  model: '',
  visible: true,
  required: false,

  textareaRows: 3,

  selectOptions: [],
  selectType: ValueTypes.TEXT,
}

export default class Form extends React.Component {

  props: {
    forms: FormObject[],
    onChange: Function,
  }

  render() {
    const { forms, onChange } = this.props;

    if (forms === undefined) return (<div></div>);

    const elements = forms.map((rawForm: FormObject, formId: number) => {
      const {
        type,
        label,
        col,
        disabled,
        value,
        model,
        visible,
        required,

        textareaRows,
        selectOptions,
        selectType,
      } = { ...defaultForm, ...rawForm };

      const display = visible ? {} : { display: 'none' };

      let innerForm;
      switch (type) {
        case FormTypes.TEXT:
          innerForm = (
            <div className="form-group">
              <label className="control-label">{label}</label>
              <input type="text" className="form-control input-sm" value={value} onChange={handleChange(model, onChange)} disabled={disabled} required={required} />
            </div>
          );
          break;
        case FormTypes.TEXTAREA:
          innerForm = (
            <div className="form-group">
              <label className="control-label">{label}</label>
              <textarea className="form-control input-sm" rows={textareaRows} value={value} onChange={handleChange(model, onChange)} disabled={disabled} required={required} />
            </div>
          );
          break;
        case FormTypes.NUMBER:
          const fixNumberValue = isNaN(value) || value === '' ? '0' : value;
          innerForm = (
            <div className="form-group">
              <label className="control-label">{label}</label>
              <input type="number" className="form-control input-sm" value={fixNumberValue} onChange={handleChange(model, onChange, ValueTypes.NUMBER)} disabled={disabled} required={required} />
            </div>
          );
          break;
        case FormTypes.SWITCH:
          const fixSwitchValue = value === 'false' ? false : value;
          innerForm = (
            <div className="form-group">
              <label className="control-label">{label}</label>
              <input type="checkbox" className="form-control input-sm" checked={fixSwitchValue} onChange={handleChange(model, onChange, ValueTypes.BOOLEAN)} disabled={disabled} required={required} />
            </div>
          );
          break;
        case FormTypes.DATE:
          const fixDateValue = moment(value).isValid() ? moment(value) : moment();
          innerForm = (
            <div className="form-group">
              <label className="control-label">{label}</label>
              <input type="date" className="form-control input-sm" value={fixDateValue.format('YYYY-MM-DD')} onChange={handleChange(model, onChange, ValueTypes.DATE)} disabled={disabled} required={required} />
            </div>
          );
          break;
        case FormTypes.SELECT:
          innerForm = (
            <div className="form-group">
              <label className="control-label">{label}</label>
              <select className="form-control input-sm" onChange={handleChange(model, onChange, selectType)} value={value} disabled={disabled} required={required}>
                {selectOptions.map((opt, optId) =>
                  <option value={opt.value} key={optId}>{opt.text}</option>
                )}
              </select>
            </div>
          );
          break;
        default:
          innerForm = '';
      }

      return (
        <div className={`col-md-${col}`} key={formId} style={display}>
          {innerForm}
        </div>
      )
    });

    return (
      <form className="horizontal-form">
        <div className="form-body">
          <div className="row">
            {elements}
          </div>
        </div>
      </form>
    );
  }

}
