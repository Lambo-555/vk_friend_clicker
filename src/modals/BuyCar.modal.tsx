import { Icon24CheckCircleFillGreen, Icon24CancelCircleFillRed, Icon28CarOutline } from "@vkontakte/icons"
import { Button, ButtonGroup, ModalCard, Spacing } from "@vkontakte/vkui"
import React from "react"

export const BuyCarModal = ({ id, setCurrentModal }: { id: string, setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {
    const headerTextPull = [
        "Наконец-то избавился от этого хлама, в магазине стало светлее",
        "Продал этот хлам и почувствовал, что стало легче на душе",
        "Хлам ушел из моего магазина, как камень с моей души",
        "Спасибо, что купил это, вот я бы не взял, но ты молодец",
        "Молодец, респект от разработчиков, красавчик",
        "Упс, я это не хотел продавать, ххммм... Что же делать то теперь...",
    ];
    const headerText = headerTextPull[Math.floor(headerTextPull.length * Math.random())];

    const okTextPull = [
        "Ну скидка же была",
        "Надо было, наверное",
        "Не удержался, бывает",
        "Поддержал бизнес, ...твой",
        "Буду ремонтировать, или нет",
        "Вдруг пригодится",
        "Новая коллекция, да?"
    ];
    const okText = okTextPull[Math.floor(okTextPull.length * Math.random())];

    const wrongTextPull = [
        "Что я сделал?",
        "Пустая трата",
        "Подвел себя",
        "Опять ошибся",
        "Как я мог",
        "Пойду плакать",
        "Лапкой промахнулся",
        "Не туда нажал",
        "Мой косяк",
        "Пук-пук",
    ];
    const wrongText = wrongTextPull[Math.floor(wrongTextPull.length * Math.random())];

    return (
        <ModalCard
            id={id}
            onClose={() => setCurrentModal(null)}

            icon={<Icon28CarOutline />}
            header="Поздравляем с покупкой! ВОЗВРАТОВ НЕТ!"
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
                        <Button before={<Icon24CancelCircleFillRed />} onClick={() => setCurrentModal(null)} size="l" mode="secondary" stretched>
                            {wrongText}
                        </Button>
                    </ButtonGroup>
                </React.Fragment>
            }
        />
    )
}