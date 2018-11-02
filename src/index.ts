import dayjs = require("dayjs");

declare var global: any;
global.cleanupMail = cleanupMail;

type SearchTargetItem = { search: string; expireBeforeDays: number };
const BATCH_SIZE = 100; // Process up to 100 threads at once
function deleteThread(searchTargetItems: SearchTargetItem[]) {
    searchTargetItems.forEach(target => {
        const searchCondition = `${target.search} older_than:${target.expireBeforeDays}d`;
        Logger.log(`SearchCondition: ${searchCondition}`);
        // Note: Gmail's limitation
        // moveThreadsToTrash work only in less than 100
        const threads = GmailApp.search(searchCondition);
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
        Logger.log(`Delete All ${filteredThreads.length} threads`);
        for (let i = 0; i < threads.length; i += BATCH_SIZE) {
            const deleteThread = filteredThreads.slice(i, i + BATCH_SIZE);
            if (deleteThread.length > 0) {
                GmailApp.moveThreadsToTrash(deleteThread);
            }
            Logger.log(`Delete ${deleteThread.length} threads`);
        }
    });
}

function cleanupMail() {
    /**
     * Cleanup condition
     */
    const conditions: SearchTargetItem[] = [
        {
            search: "label:notification -is:starred",
            // older than 730 days
            expireBeforeDays: 730
        }
    ];
    // delete threads that match condition
    deleteThread(conditions);
}
