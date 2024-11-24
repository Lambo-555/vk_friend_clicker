import { Icon28PaymentCardOutline } from "@vkontakte/icons";
import { ModalPage, ModalPageHeader, PanelHeaderClose, Group, ContentCard, CardGrid, Button } from "@vkontakte/vkui";
import vkBridge from '@vkontakte/vk-bridge';
import { ReactNode } from "react";
import { openSnackbar } from "../panels/utils";


export const PaymentModal = ({ id, setCurrentModal, setPopout }: { id: string, setCurrentModal: React.Dispatch<React.SetStateAction<any>>, setPopout: React.Dispatch<React.SetStateAction<ReactNode>> }) => {
    const handlePayment = async (id: number) => {
        try {
            const result = await vkBridge.send("VKWebAppShowOrderBox", { type: "item", item: String(id) });
            openSnackbar(setPopout, 'Ухууу, успешная покупкааа!!! Скорей смотреть гараж и пояс!!!', <Icon28PaymentCardOutline />);
            console.log('Покупка состоялась.', result);
        } catch (error: any) {
            openSnackbar(setPopout, 'Ошибочка вышла, попробуйте позже! ' + error?.error_data?.error_reason, <Icon28PaymentCardOutline />);
            console.log('Ошибка!', error);
        }
    };

    return (
        <ModalPage
            id={id}
            onClose={() => setCurrentModal(null)}
            header={
                <ModalPageHeader
                    before={
                        <PanelHeaderClose onClick={() => setCurrentModal(null)} />
                    }
                // after={<PanelHeaderSubmit onClick={() => setCurrentModal(null)} />}
                >
                    Товары
                </ModalPageHeader>
            }
        >
            <Group>
                <CardGrid size="l">

                    <ContentCard
                        subtitle="Неплохо"
                        header="База пак"
                        text="Поехали! В паке тебя ждет +5000 кредитов, неплохая машина и базовый молоток. Этого хватит для начала хорошего краш бизнеса."
                        caption={
                            <Button before={<Icon28PaymentCardOutline />} onClick={() => handlePayment(1)} size="s" appearance="positive" stretched>
                                Взять за 10 голосов
                            </Button>
                        }
                    />
                    <ContentCard
                        subtitle="Прям хорошо"
                        header="Гангста пак"
                        text="Нет времени ждать, в ход идет то, что попалось под руку: крутой молоток, солидный хлам, +25К кредитов. Скоро все будет в дребезги!"
                        caption={
                            <Button before={<Icon28PaymentCardOutline />} onClick={() => handlePayment(2)} size="s" appearance="positive" stretched>
                                Отхватить за 25 голосов
                            </Button>
                        }
                    />
                    <ContentCard
                        subtitle="Дикий топ"
                        header="Габар пак"
                        text="Взял молоток и накинулся! За столом собрались настоящие отморозки, топ авто, топ молоток, +300.000 кредитов. Перебинтовывай пальцы, тапать придется много и в удовольствие."
                        caption={
                            <Button before={<Icon28PaymentCardOutline />} onClick={() => handlePayment(3)} size="s" appearance="positive" stretched>
                                Накинуться за 100 голосов
                            </Button>
                        }
                    />
                </CardGrid>
            </Group>
        </ModalPage>
    )
}