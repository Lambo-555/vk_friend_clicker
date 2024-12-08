import { Icon24CheckCircleFillGreen, Icon28CarOutline } from "@vkontakte/icons"
import { Button, ButtonGroup, ModalCard, Spacing } from "@vkontakte/vkui"
import React, { useEffect, useState } from "react"

const headerTextPull = [
    "Наконец-то избавился от этого хлама, в магазине стало светлее",
    "Продал этот хлам и почувствовал, что стало легче на душе",
    "Хлам ушел из моего магазина, как камень с моей души",
    "Спасибо, что купил это, вот я бы не взял, но ты молодец",
    "Молодец, респект от разработчиков, красавчик",
    "Упс, я это не хотел продавать, ххммм... Что же делать то теперь...",
];

const okTextPull = [
    "Ну скидка же была",
    "Надо было, наверное",
    "Не удержался, бывает",
    "Поддержал бизнес, ...твой",
    "Буду ремонтировать, или нет",
    "Вдруг пригодится",
    "Новая коллекция, да?"
];

export const BuyCarModal = ({ id, setCurrentModal }: { id: string, setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {
    const [okText, setOkText] = useState<string>('Отлично');
    const [headerText, setHeaderText] = useState<string>('Отлично');
    
    useEffect(() => {
        const okText = okTextPull[Math.floor(okTextPull.length * Math.random())];
        setOkText(okText);

        const headerTextGen = headerTextPull[Math.floor(headerTextPull.length * Math.random())];
        setHeaderText(headerTextGen);
    }, [setCurrentModal])

    return (
        <ModalCard
            id={id}
            onClose={() => setCurrentModal(null)}

            icon={<Icon28CarOutline />}
            header="Поздравляем с покупкой! Пара слов от продавца:"
            subheader={headerText}
            actions={
                <React.Fragment>
                    <Spacing size={16} />
                    <ButtonGroup mode="vertical" gap="s" stretched>
                        <Button before={<Icon24CheckCircleFillGreen />} size="l" mode="primary" stretched
                            onClick={() => setCurrentModal(null)}
                        >
                            {okText}
                        </Button>
                    </ButtonGroup>
                </React.Fragment>
            }
        />
    )
}