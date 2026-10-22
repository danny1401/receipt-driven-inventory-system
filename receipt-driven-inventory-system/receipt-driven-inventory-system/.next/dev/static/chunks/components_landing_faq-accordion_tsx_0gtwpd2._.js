(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/landing/faq-accordion.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FAQAccordion",
    ()=>FAQAccordion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/ui/accordion'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use client";
;
;
const FAQ_ITEMS = [
    {
        value: "formats",
        question: "What file formats can I upload?",
        answer: "PDF supplier invoices and order confirmations today. The parser is built for structured receipts that carry line items, quantities, units, and prices — the documents that normally get typed into a spreadsheet by hand."
    },
    {
        value: "accuracy",
        question: "How accurate is the extraction?",
        answer: "Parsing runs on Google Gemini and every result is validated against your schema. Anything the model isn't confident about is flagged for review instead of being silently imported, so a bad read never corrupts your stock counts."
    },
    {
        value: "scale",
        question: "Does it handle multiple suppliers and locations?",
        answer: "Yes. Each receipt is matched to a supplier organization and a customer (restaurant), so you can track inventory, spend, and deliveries across your whole network from one place."
    },
    {
        value: "corrections",
        question: "Can I fix a receipt that was read incorrectly?",
        answer: "Receipts marked for review can be corrected before they affect inventory. You keep a full record of the original PDF alongside the parsed line items."
    },
    {
        value: "data",
        question: "Where is my data stored?",
        answer: "Receipts and line items live in Convex, with the original PDFs kept in file storage. Authentication is handled with Better Auth and Google sign-in."
    },
    {
        value: "start",
        question: "How do I get started?",
        answer: "Sign in with Google and upload your first receipt. There is nothing to install and no spreadsheet template to maintain."
    }
];
function FAQAccordion() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Accordion, {
        className: "mx-auto w-full max-w-3xl",
        children: FAQ_ITEMS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AccordionItem, {
                value: item.value,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AccordionTrigger, {
                        className: "text-base",
                        children: item.question
                    }, void 0, false, {
                        fileName: "[project]/components/landing/faq-accordion.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AccordionContent, {
                        className: "max-w-2xl text-muted-foreground",
                        children: item.answer
                    }, void 0, false, {
                        fileName: "[project]/components/landing/faq-accordion.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this)
                ]
            }, item.value, true, {
                fileName: "[project]/components/landing/faq-accordion.tsx",
                lineNumber: 53,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/landing/faq-accordion.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_c = FAQAccordion;
var _c;
__turbopack_context__.k.register(_c, "FAQAccordion");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_landing_faq-accordion_tsx_0gtwpd2._.js.map