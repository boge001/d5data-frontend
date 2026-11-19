import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const resume = {
  name: 'Alex-Chen-Resume.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4\nResume test fixture\n%%EOF'),
}

async function dropFiles(
  page: Page,
  files: { name: string; type: string; content: string }[],
) {
  const transfer = await page.evaluateHandle((items) => {
    const data = new DataTransfer()
    items.forEach((item) =>
      data.items.add(new File([item.content], item.name, { type: item.type })),
    )
    return data
  }, files)
  await page.locator('.dropzone').dispatchEvent('dragenter', {
    dataTransfer: transfer,
  })
  await page.locator('.dropzone').dispatchEvent('drop', {
    dataTransfer: transfer,
  })
  await transfer.dispose()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
})

test('matches the main desktop layout and loads the supplied illustration', async ({
  page,
}) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Finish!Upload Your Resume',
  )
  const card = await page.locator('.upload-card').boundingBox()
  const dropzone = await page.locator('.dropzone').boundingBox()
  expect(card?.x).toBeCloseTo(875, 0)
  expect(card?.y).toBeCloseTo(103, 0)
  expect(card?.width).toBeCloseTo(943, 0)
  expect(card?.height).toBeCloseTo(922, 0)
  expect(dropzone?.x).toBeCloseTo(1004, 0)
  expect(dropzone?.y).toBeCloseTo(221, 0)
  expect(dropzone?.height).toBeCloseTo(420, 0)
  expect(dropzone?.width).toBeCloseTo(685, 0)
  const title = await page.locator('h1').boundingBox()
  const description = await page
    .locator('.introduction__description')
    .boundingBox()
  expect(title?.width).toBeCloseTo(394, 0)
  expect(title?.height).toBeCloseTo(110, 0)
  expect(description?.width).toBeCloseTo(696, 0)
  expect(description?.height).toBeCloseTo(70, 0)
  const button = await page
    .getByRole('button', { name: 'Finish', exact: true })
    .boundingBox()
  expect(button?.width).toBeCloseTo(272, 0)
  expect(button?.height).toBeCloseTo(67, 0)
  const line = await page.locator('.steps__list').evaluate((element) => {
    const style = getComputedStyle(element, '::after')
    return { width: parseFloat(style.width), height: parseFloat(style.height) }
  })
  expect(line.width).toBeCloseTo(299, 0)
  expect(line.height).toBe(4)
  await expect(page.locator('.illustration img')).toHaveJSProperty(
    'naturalWidth',
    800,
  )
  await expect(page.locator('[aria-current="step"]')).toContainText('Step 3')
})

test('opens the native file chooser and displays the selected filename', async ({
  page,
}) => {
  const chooserEvent = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Choose your resume' }).click()
  const chooser = await chooserEvent
  await chooser.setFiles(resume)
  await expect(page.locator('.dropzone__filename')).toHaveText(resume.name)
  await expect(page.getByRole('status')).toContainText(
    `${resume.name} selected`,
  )
})

test('supports drag and drop and clears the active drag state', async ({
  page,
}) => {
  await dropFiles(page, [
    {
      name: 'Resume.DOCX',
      type: 'application/octet-stream',
      content: 'document',
    },
  ])
  await expect(page.locator('.dropzone__filename')).toHaveText('Resume.DOCX')
  await expect(page.locator('.dropzone')).not.toHaveClass(/dragging/)
})

test('keeps a valid selection when a replacement has an unsupported extension', async ({
  page,
}) => {
  await page.locator('input[type="file"]').setInputFiles(resume)
  await page.locator('input[type="file"]').setInputFiles({
    name: 'portrait.png',
    mimeType: 'image/png',
    buffer: Buffer.from('image'),
  })
  await expect(page.getByRole('alert')).toHaveText(
    'Please choose a PDF, DOC, or DOCX file.',
  )
  await expect(page.locator('.dropzone__filename')).toHaveText(resume.name)
})

test('rejects empty, oversized, and multiple files', async ({ page }) => {
  await page.locator('input[type="file"]').setInputFiles({
    ...resume,
    buffer: Buffer.alloc(0),
  })
  await expect(page.getByRole('alert')).toContainText('empty')

  await page.locator('input[type="file"]').setInputFiles({
    ...resume,
    buffer: Buffer.alloc(10 * 1024 * 1024 + 1, 65),
  })
  await expect(page.getByRole('alert')).toHaveText(
    'Your resume must be 10 MB or smaller.',
  )

  await dropFiles(page, [
    { name: 'one.pdf', type: 'application/pdf', content: 'one' },
    { name: 'two.pdf', type: 'application/pdf', content: 'two' },
  ])
  await expect(page.getByRole('alert')).toHaveText(
    'Please choose one resume at a time.',
  )
  await expect(page.locator('.dropzone__filename')).toHaveCount(0)
})

test('removes a file and allows choosing the same file again', async ({
  page,
}) => {
  await page.locator('input[type="file"]').setInputFiles(resume)
  await page.getByRole('button', { name: 'Remove resume' }).click()
  await expect(
    page.getByRole('button', { name: 'Choose your resume' }),
  ).toBeFocused()
  await page.locator('input[type="file"]').setInputFiles(resume)
  await expect(page.locator('.dropzone__filename')).toHaveText(resume.name)
})

test('preserves the file while reviewing and completing the final step', async ({
  page,
}) => {
  await page.locator('input[type="file"]').setInputFiles(resume)
  await page.getByRole('button', { name: 'Last step' }).click()
  await expect(
    page.getByRole('heading', { name: 'Review your resume' }),
  ).toBeFocused()
  await expect(page.locator('[aria-current="step"]')).toContainText('Step 2')
  await expect(page.locator('.summary__filename')).toHaveText(resume.name)
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.locator('.dropzone__filename')).toHaveText(resume.name)
  await page.getByRole('button', { name: 'Finish', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'All set!' })).toBeFocused()
  await expect(page.locator('.summary__filename')).toHaveText(resume.name)
  await page.getByRole('button', { name: 'Back to upload' }).click()
  await expect(page.locator('.dropzone__filename')).toHaveText(resume.name)
})

test('allows finishing without a resume, as described in the design', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Finish', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'You can add a resume later' }),
  ).toBeVisible()
})

test('supports a keyboard file chooser and visible focus', async ({ page }) => {
  await page.keyboard.press('Tab')
  const button = page.getByRole('button', { name: 'Choose your resume' })
  await expect(button).toBeFocused()
  const chooserEvent = page.waitForEvent('filechooser')
  await page.keyboard.press('Enter')
  const chooser = await chooserEvent
  await chooser.setFiles(resume)
  await expect(page.locator('.dropzone__filename')).toHaveText(resume.name)
})

for (const width of [320, 390, 768, 1280]) {
  test(`fits a ${width}px viewport without horizontal overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(horizontalOverflow).toBe(false)
    const card = await page.locator('.upload-card').boundingBox()
    const introduction = await page.locator('.introduction').boundingBox()
    if (width <= 1100) {
      expect(card!.y).toBeGreaterThan(introduction!.y + introduction!.height)
    }
    await expect(
      page.getByRole('button', { name: 'Finish', exact: true }),
    ).toBeVisible()
  })
}

test('wraps long filenames on a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  const longName = `${'Very-long-resume-name-'.repeat(8)}.pdf`
  await page
    .locator('input[type="file"]')
    .setInputFiles({ ...resume, name: longName })
  await expect(page.locator('.dropzone__filename')).toHaveText(longName)
  const zone = await page.locator('.dropzone').boundingBox()
  const content = await page.locator('.dropzone__content').boundingBox()
  expect(content!.y).toBeGreaterThanOrEqual(zone!.y)
  expect(content!.y + content!.height).toBeLessThanOrEqual(
    zone!.y + zone!.height,
  )
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false)
})

test('does not send the selected resume to a server', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => {
    if (request.method() === 'POST') requests.push(request.url())
  })
  await page.locator('input[type="file"]').setInputFiles(resume)
  await page.getByRole('button', { name: 'Finish', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'All set!' })).toBeVisible()
  expect(requests).toEqual([])
})
