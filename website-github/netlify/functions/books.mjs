diff --git a/website-github/netlify/functions/books.mjs b/website-github/netlify/functions/books.mjs
index 700c968..29685d0 100644
--- a/website-github/netlify/functions/books.mjs
+++ b/website-github/netlify/functions/books.mjs
@@ -103,6 +103,7 @@ export default async (req) => {
       genre:  getProperty(page.properties, "Genre", "select"),
       blurb:  getProperty(page.properties, "Three Sentences", "rich_text"),
       hasEpub: getProperty(page.properties, ".epub", "files") || false,
+      readingOrder: page.properties["Reading Order"]?.number ?? null,
     }));
 
     // 3. Fetch cover images with concurrency limit of 8
@@ -110,8 +111,14 @@ export default async (req) => {
       book.cover = await getPageCover(book.id, token);
     });
 
-    // 4. Sort newest first by createdTime
-    booksMeta.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
+    // 4. Sort by Reading Order (highest = most recently read) first;
+    //    fall back to createdTime for any pages missing a number.
+    booksMeta.sort((a, b) => {
+      if (a.readingOrder != null && b.readingOrder != null) return b.readingOrder - a.readingOrder;
+      if (a.readingOrder != null) return -1;
+      if (b.readingOrder != null) return 1;
+      return new Date(b.createdTime) - new Date(a.createdTime);
+    });
 
     return new Response(JSON.stringify(booksMeta), { status: 200, headers: CORS });
   } catch (err) {
