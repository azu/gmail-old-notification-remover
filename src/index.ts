import dayjs = require("dayjs");

declare var global: any;
global.cleanupMail = cleanupMail;

type SearchTargetItem = { search: string; expireBeforeDays: number };

function deleteThread(searchTargetItems: SearchTargetItem[]) {
    searchTargetItems.forEach(target => {
        const searchCondition = `${target.search} older_than:${target.expireBeforeDays}d`;
        Logger.log(`SearchCondition: ${searchCondition}`);
        // Note: Gmail's limitation
        // moveThreadsToTrash work only in less than 100
        const threads = GmailApp.search(searchCondition, 0, 100);
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

function cleanupMail() {
    /**
     * Cleanup condition
     */
    const conditions: SearchTargetItem[] = [
        {
            search: "label:notification -is:starred",
            // older than 365 days
            expireBeforeDays: 365
        }
    ];
    // delete threads that match condition
    deleteThread(conditions);
}
