import { Page, Locator, expect } from '@playwright/test'
export class PublicationPriceListPage {

    public page: Page
    public publishedButton: Locator
    public project: Locator
    public successAllert: Locator
    public choice: Locator
    public toDraftList: Locator

    constructor(page: Page) {
        this.page = page
        this.publishedButton = page.getByRole('button', { name: 'Опубликовано' })
        this.project = page.locator('article').filter({ hasText: process.env.PROJECT_NAME! }).nth(0) // хардкод
        this.successAllert = page.getByRole('heading', { name: 'Изменения цен успешно опубликованы' })
        this.choice = page.locator('[data-index="14836386"]') // название плохое
        this.toDraftList = page.getByRole('link', { name: 'Редакторе цен.' }) // название плохое, соотнеси с названием метода в котором используешь
    }
    async publishedPage(): Promise<void> { // переход на вкладку опубликовано и открытие прайс листа  - у всех методов пропиши пожалуйста модификатор public тогда - глагол!
        await this.publishedButton.click()
        await this.project.click()
    }
    async checkSuccessAlert(): Promise<Locator> { // проверка надичия текса в аллерте успеха (по сути, проверка наличия алерта) - у тебя он может быть и неудачным, поэтому предлагаю просто checkAllert или checkPublishingAllert
        return this.successAllert; 
    }

    async checkChess(): Promise<Locator> { // проверка что на шахматке отмечены помещения с измененной ценой - лучше проверять в теле и возвращать true и false + название не оч
        return this.choice;
    }

    async followLinkInAlert(): Promise<void> { // переход по ссылки в аллерте на вкладку в работе 
        await this.toDraftList.click()
    }
}

