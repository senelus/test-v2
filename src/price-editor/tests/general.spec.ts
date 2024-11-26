import { test, expect, Locator } from '@playwright/test'
import { LoginPage } from '../page-object/login-page' // можешь добавить индексный файл, чтобы уменьшить количество импортов https://stackoverflow.com/questions/34072598/es6-exporting-importing-in-index-file
import { CreatingPriceListPage } from '../page-object/creating-price-list'
import { FiltrationPage } from '../page-object/filtration'
import { ChangesPriceListPage } from '../page-object/changes-price-list'
import { CheckPriceListPage } from '../page-object/check-price-list'
import { ListOfChangesPage } from '../page-object/list-of-changes'
import { PublicationPriceListPage } from '../page-object/publication-price-list'

/*
0. Логин
1. Создание черновика
2. Применение фильтра 
3. Переключение на Шахматку+, выбор помещений (разными спосабами) и изменение цены. На один этаж увеличить на второй уменьшить на третий заменить
4. Переход на шахматку и проверка цен
5. Переход в список изменений, часть удаляется, часть редактируется, и изменяется цена на первичные значения.
6. Публикация и проверка 
Что сделать в будущем:
1.1 Добавить создание ЖК и дома что бы не быть привязаным к дому и стенду
1.2 Добавить проверки крит. изменения цены и изменение баз. стоимости
1.3 На подходе кастомные фильтры
*/

test('https://jira.abanking.ru/secure/Tests.jspa#/testCase/PBA-T353', async ({ page }) => {

    test.slow();

    const loginPage: LoginPage = new LoginPage(page) 
    await loginPage.open()
    await loginPage.login()

    const creatingPriceListPage: CreatingPriceListPage = new CreatingPriceListPage(page) 
    await creatingPriceListPage.createPriceList()

    const filtrationPage: FiltrationPage = new FiltrationPage(page) 
    await filtrationPage.clickfilterButton()
    await filtrationPage.choiceOfFloor()
    await filtrationPage.choiceOfRoom()
    await filtrationPage.choiceStatus()
    const filteringAssertion: Locator = await filtrationPage.checkFilterChess()
    await expect(filteringAssertion).toHaveAttribute('data-filtered', 'true')
    await filtrationPage.resetFilter()

    const changesPriceListPage = new ChangesPriceListPage(page); 

    await changesPriceListPage.switchToChess();
    await changesPriceListPage.changePriceOnFloor(1, '10000','Увеличить'); // если функция принимает 2+ параметров, то лучше сделать, чтобы она принимала объект и тогда твой вызов выглядел примерно так: https://disk.yandex.ru/i/jCLzA4z-PBXx8Q
    await changesPriceListPage.changePriceOnFloor(2, '10000', 'Уменьшить', '₽');
    await changesPriceListPage.changePriceOnFloor(3, '555555', 'Заменить');
    await changesPriceListPage.changePriceOnFloor(4, '5', 'Увеличить', '%');
    await changesPriceListPage.changePriceOnFloor(5, '5', 'Уменьшить', '%');

    const checkPriceListPage: CheckPriceListPage = new CheckPriceListPage(page) // это точно отдельная страница?
    await checkPriceListPage.checkResult() // тут ничего не понял, выглядит плохо и хардкодно
    await checkPriceListPage.checkAllertReselection()

    const listOfChangesPage: ListOfChangesPage = new ListOfChangesPage(page) 
    await listOfChangesPage.changesPage()
    await listOfChangesPage.choiceApartments()
    await listOfChangesPage.deletionApartmens()
    await listOfChangesPage.selectEntirePage()
    await listOfChangesPage.replacementPrice()
    await listOfChangesPage.publicationPrice()

    const publicationPriceListPage: PublicationPriceListPage = new PublicationPriceListPage(page) 
    await publicationPriceListPage.publishedPage();
    const successAlert = await publicationPriceListPage.checkSuccessAlert()
    await expect(successAlert).toHaveText('Изменения цен успешно опубликованы')
    const choice = publicationPriceListPage.choice
    await expect(choice).toHaveAttribute('data-selected', 'true')
    await publicationPriceListPage.followLinkInAlert() // больше проверок не будет, все?
})

// артифакты добавить в гитигнор, а то мусора куча в индексе гита