import Vue from 'vue'
import {
    Message,
    Notification,
    Button,
    Form,
    FormItem,
    Input,
    Card,
    Row,
    Col,
    Select,
    Option,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Radio,
    RadioGroup,
    RadioButton,
    Dialog,
    Tag,
    Table,
    TableColumn,
    ButtonGroup,
    Switch,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    MessageBox,
    Container,
    Header,
    Aside,
    Main,
    Pagination

}from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css'
export default {
	install (Vue){
		Vue.use(Button)
		Vue.use(Form)
		Vue.use(FormItem)
		Vue.use(Input)
		Vue.use(Card)
        Vue.use(Menu);
        Vue.use(Submenu);
        Vue.use(MenuItem);
        Vue.use(MenuItemGroup);
        Vue.use(Select);
        Vue.use(Option);
        Vue.use(Row);
        Vue.use(Col);
        Vue.use(Radio);
        Vue.use(RadioGroup);
        Vue.use(RadioButton);
        Vue.use(Dialog);
        Vue.use(Tag);
        Vue.use(Table);
        Vue.use(TableColumn);
        Vue.use(DatePicker);
        Vue.use(ButtonGroup);
        Vue.use(Switch);
        Vue.use(Checkbox);
        Vue.use(CheckboxGroup);
        Vue.use(DatePicker);
        Vue.use(Container);
        Vue.use(Header);
        Vue.use(Aside);
        Vue.use(Main);
        Vue.use(Pagination);
		Vue.prototype.$message = Message
		Vue.prototype.$notify = Notification
        Vue.prototype.$confirm = MessageBox.confirm;
        Vue.prototype.$ELEMENT = { size: 'small' }
	}
}
