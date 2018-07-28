import GmailApp = GoogleAppsScript.Gmail.GmailApp;

declare var global: any;
global.cleanupMail = cleanupMail;

function cleanupMail() {
    /**
     * Cleanup condition
     */
    const targets = [
        {
            search: "label:notification",
            // 365日より前のものが対象
            expireBefore: `365d`
        }
    ];

    const IgnoreRule = `-in:starred or -in:important`;

    // 対象ラベルのループ処理
    targets.forEach(target => {
        const searchCondition = `${target.search} older_than:${target.expireBefore} and (${IgnoreRule})`;
        Logger.log(`SearchCondition: ${searchCondition}`);
        const threads = GmailApp.search(searchCondition, 0, 50);
        Logger.log(`Match threads count: ${threads.length}`);
        if (threads.length === 0) {
            return;
        }
        GmailApp.moveThreadsToTrash(threads);
        Logger.log(`Delete ${threads.length} threads`);
    });
}
