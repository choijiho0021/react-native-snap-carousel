import _ from 'underscore'
import api from './api'
import utils from '../utils'
import i18n from '../i18n'

class OrderAPI {
    ORDER_PAGE_ITEMS = 10

    deliveryText = [
    {
        key: i18n.t("pym:notSelected"),
        value: i18n.t("pym:notSelected")
    },
    {
        key: i18n.t("pym:tel"),
        value: i18n.t("pym:toTel")
    },
    {
        key: i18n.t("pym:frontDoor"),
        value: i18n.t("pym:atFrontDoor")
    },
    {
        key: i18n.t("pym:deliveryBox"),
        value: i18n.t("pym:toDeliveryBox")
    },
    {
        key: i18n.t("pym:security"),
        value: i18n.t("pym:toSecurity")
    },
    {
        key: i18n.t("pym:input"),
        value: i18n.t("pym:input")
    }]

    shipmentState = {
        DRAFT: 'draft',
        READY: 'ready',
        SHIP: 'shipped',
        CANCEL: 'canceled'
    }

    toOrder = (data, page) => {

        if ( _.isArray(data) && data.length > 0) {

            return api.success( data.map(item => {
                const paymentList = JSON.parse(item.payment_list),
                    balanceCharge = paymentList.find(value => value.payment_gateway == 'rokebi_cash')

                return {
                    key: item.order_id,
                    orderId: utils.stringToNumber( item.order_id),
                    orderNo: item.order_number,
                    orderDate: item.placed,
                    orderType: item.type,
                    totalPrice: utils.stringToNumber( item.total_price__number),    // 배송비 불포함 금액
                    profileId: item.profile_id,
                    trackingCode: item.tracking_code,
                    trackingCompany: item.tracking_company,
                    shipmentState: item.shipment_state,
                    memo: item.memo || '',
                    state: item.state,
                    orderItems: JSON.parse(item.order_items).map(value => ({
                        title: value.title,
                        qty: parseInt(value.quantity),
                        price: utils.stringToNumber(value.total_price__number)
                    })),
                    usageList: JSON.parse(item.usage_list).map(value => ({
                        status: value.field_status,
                        nid: value.nid
                    })),
                    paymentList: JSON.parse(item.payment_list).map(value => ({
                        amount: value.amount__number,
                        paymentGateway: value.payment_gateway,
                        paymentMethod: value.payment_method,                        // 결제 수단
                    })),
                    dlvCost: utils.stringToNumber(item.dlv_cost) || 0,
                    balanceCharge : balanceCharge ? utils.stringToNumber( balanceCharge.amount__number) : 0,
                }
                }).sort((a,b) => a.orderDate < b.orderDate ? 1 : -1), [page])
        }

        return api.failure( api.E_NOT_FOUND)
    }

    getOrders = ({user, token}, page=0) => {
        const url = `${api.httpUrl(api.path.order, '')}/${user}?_format=json&page=${page}`
        const headers = api.withToken(token, 'json')

        return api.callHttp(url, {
            method: 'get',
            headers,
        }, (resp) => this.toOrder(resp, page))
    }

    getOrderById = ({user, token}, orderId) => {
        const url = `${api.httpUrl(api.path.order, '')}/${user}/${orderId}?_format=json`
        const headers = api.withToken(token, 'json')

        return api.callHttp(url, {
            method: 'get',
            headers,
        }, (resp) => this.toOrder(resp))
    }

    cancelOrder = (orderId, {token}) => {
        const url = `${api.httpUrl(api.path.commerce.order, '')}/${orderId}?_format=json`
        const headers = api.withToken(token, 'json')

        return api.callHttp(url, {
            method: 'delete',
            headers,
        }, (resp) => ({
            result: resp.status == '204' ? 0 : api.FAILED
        }))
    }

    deliveryTrackingUrl = (company, trackingCode) => {
        switch(company) {
            // 지금은 CJ 주소만 있음. 다른 회사 주소 확인 필요 
            case 'CJ':
            default:
                return `https://www.cjlogistics.com/ko/tool/parcel/newTracking?gnbInvcNo=${trackingCode}`
        }
    }
}

export default new OrderAPI()