import _ from 'underscore'
import api from './api'
import utils from '../utils'

class OrderAPI {

    toOrder = (data) => {

        if ( _.isArray(data) && data.length > 0) {

            return api.success( data.map(item => {
                const paymentList = JSON.parse(item.payment_list),
                    balanceCharge = paymentList.find(value => value.payment_gateway == 'rokebi_cash')

                return {
                    key: item.order_number,
                    orderId: item.order_number,
                    orderDate: item.placed,
                    orderType: item.type,
                    totalPrice: utils.stringToNumber( item.total_price__number),
                    profileId: item.profile_id,
                    trackingCode: item.tracking_code,
                    trackingCompany: item.tracking_company,
                    shipmentState: item.shipment_state,
                    iamportPayment: JSON.parse(item.iamport_payment).map(value => ({
                        totalPrice: utils.stringToNumber(value.amount),
                        pg: value.pg_provider,
                        cardName: value.card_name,
                        buyerAddr: value.buyer_addr,
                    })),
                    orderItems: JSON.parse(item.order_items).map(value => ({
                        title: value.title,
                        qty: parseInt(value.quantity),
                        price: utils.stringToNumber(value.total_price__number)
                    })),
                    dlvCost: utils.stringToNumber(item.dlv_cost) || 0,
                    balanceCharge : balanceCharge ? utils.stringToNumber( balanceCharge.amount__number) : 0,
                }
                }).reduce((acc,cur) => {
                    const idx = acc.findIndex(item => item.orderId == cur.orderId)
                    return ( idx < 0) ? acc.concat([cur]) :
                        acc.map(item => {
                            return (item.orderId == cur.orderId) ? {
                                ... item,
                                orderItems: item.orderItems.concat(cur.orderItems)
                            } : item
                        })
                }, []).sort((a,b) => a.orderDate < b.orderDate ? 1 : -1))
        }

        return api.failure( api.NOT_FOUND)
    }

    getOrders = ({user}) => {
        const url = `${api.httpUrl(api.path.order)}/${user}?_format=json`
        const headers = api.headers({})

        return api.callHttp(url, {
            method: 'get',
            headers,
        }, this.toOrder)
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