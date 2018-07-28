import dayjs = require("dayjs");
declare var global: any;
global.cleanupMail = cleanupMail;

type SearchTargetItem = { search: string; expireBeforeDays: number };

function cleanupMail() {
    /**
     * Cleanup condition
     */
    const targets: SearchTargetItem[] = [
        {
            search: "label:notification",
            // older than 365 days
            expireBeforeDays: 365
        }
    ];

    const IgnoreRule = `-is:starred`;

    // 対象ラベルのループ処理
    targets.forEach(target => {
        const searchCondition = `${target.search} older_than:${target.expireBeforeDays}d ${IgnoreRule}`;
        Logger.log(`SearchCondition: ${searchCondition}`);
        const threads = GmailApp.search(searchCondition, 0, 50);
        // Gmail's thread includes newer mail than expireBeforeDays.
        // It filter by expireBeforeDays
        const filteredThreads = threads.filter(thread => {
            const lastMessageDate = thread.getLastMessageDate();
            const limitDay = dayjs().subtract(target.expireBeforeDays, "day");
            return dayjs(lastMessageDate).isBefore(limitDay);
        });
        Logger.log(`Match threads count: ${filteredThreads.length}`);
        if (filteredThreads.length === 0) {
            return;
        }
        GmailApp.moveThreadsToTrash(filteredThreads);
        Logger.log(`Delete ${filteredThreads.length} threads`);
    });
}
