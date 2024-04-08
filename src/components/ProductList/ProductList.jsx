import React, { useState, useEffect, useCallback } from 'react';
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useTelegram } from '../../hooks/useTelegram';

const products = [
    {
        id: '1',
        title: 'iPhone15',
        price: 70000,
        description: 'Телефон Apple iPhone 15 128Gb Dual sim (Black)',
    },
    {
        id: '2',
        title: 'iPhone15 Pro',
        price: 90000,
        description: 'Телефон Apple iPhone 15 Pro 128Gb eSim (White titanium)',
    },
    {
        id: '3',
        title: 'iPhone15 Pro Max',
        price: 111000,
        description:
            'Телефон Apple iPhone 15 Pro Max 256Gb eSim (Blue titanium)',
    },
    {
        id: '4',
        title: 'MacBook Pro M3',
        price: 150000,
        description:
            'Ноутбук Apple MacBook Pro 14" (M3 , 8 Gb, 512Gb SSD) Серый космос (MTL73)',
    },
    {
        id: '5',
        title: 'MacBook Air M3',
        price: 117000,
        description:
            'Ноутбук Apple MacBook Air 13.6" (M3, 8 Gb, 256 Gb SSD) Темно-синий (MRXV3)',
    },
    {
        id: '6',
        title: 'AirPods Pro 2',
        price: 20000,
        description: 'Беспроводные наушники Apple AirPods Pro 2 (2022)',
    },
    {
        id: '7',
        title: 'Apple Watch Ultra 2',
        price: 75000,
        description:
            'Часы Apple Watch Ultra 2 GPS + Cellular 49 мм, титановый корпус, ремешок Trail цвета Зеленый/Серый,размер L/M',
    },
];

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return (acc += item.price);
    }, 0);
};

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const { tg, queryId } = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        };

        fetch('https://localhost:8000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        tg.sendData(JSON.stringify(data));
    }, []);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    });

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find((item) => item.id === product.id);
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter((item) => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems);

        if (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`,
            });
        }
    };

    return (
        <div className={'list'}>
            {products.map((item) => (
                <ProductItem
                    className={'item'}
                    product={item}
                    onAdd={onAdd}
                />
            ))}
        </div>
    );
};

export default ProductList;
