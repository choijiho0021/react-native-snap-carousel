import _ from 'underscore'
import api from './api'
import utils from '../utils'

class OrderAPI {

    toOrder = (data) => {
        if ( _.isArray(data) && data.length > 0) {
            return api.success(
                data.map(item => ({
                    key: item.order_number,
                    orderId: item.order_number,
                    orderDate: item.placed,
                    totalPrice: utils.stringToNumber( item.total_price__number),
                    orderItems: [{
                        title: item.title,
                        price: utils.stringToNumber( item.item_price)
                    }]
                })).reduce((acc,cur) => {
                    const idx = acc.findIndex(item => item.orderId == cur.orderId)
                    return ( idx < 0) ? acc.concat([cur]) :
                        acc.map(item => {
                            return (item.orderId == cur.orderId) ? {
                                ... item,
                                orderItems: item.orderItems.concat(cur.orderItems)
                            } : item
                        })
                }, []).sort((a,b) => a.orderDate < b.orderDate ? 1 : -1)
            )
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
}

export default new OrderAPI()