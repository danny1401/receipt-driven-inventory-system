(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/landing/faq-accordion.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FAQAccordion",
    ()=>FAQAccordion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/accordion.tsx [app-client] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Accordion"], {
        className: "mx-auto w-full max-w-3xl",
        children: FAQ_ITEMS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionItem"], {
                value: item.value,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionTrigger"], {
                        className: "text-base",
                        children: item.question
                    }, void 0, false, {
                        fileName: "[project]/components/landing/faq-accordion.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionContent"], {
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
"[project]/components/ui/accordion.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Accordion",
    ()=>Accordion,
    "AccordionContent",
    ()=>AccordionContent,
    "AccordionItem",
    ()=>AccordionItem,
    "AccordionTrigger",
    ()=>AccordionTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$index$2e$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Accordion$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/index.parts.mjs [app-client] (ecmascript) <export * as Accordion>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cn$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/cn/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.mjs [app-client] (ecmascript) <export default as ChevronUpIcon>");
;
;
;
;
function Accordion({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$index$2e$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Accordion$3e$__["Accordion"].Root, {
        "data-slot": "accordion",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cn$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["cn"])("flex w-full flex-col", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/accordion.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Accordion;
function AccordionItem({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$index$2e$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Accordion$3e$__["Accordion"].Item, {
        "data-slot": "accordion-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cn$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["cn"])("not-last:border-b", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/accordion.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c1 = AccordionItem;
function AccordionTrigger({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$index$2e$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Accordion$3e$__["Accordion"].Header, {
        className: "flex",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$index$2e$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Accordion$3e$__["Accordion"].Trigger, {
            "data-slot": "accordion-trigger",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cn$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["cn"])("group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground", className),
            ...props,
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                    "data-slot": "accordion-trigger-icon",
                    className: "pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
                }, void 0, false, {
                    fileName: "[project]/components/ui/accordion.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__["ChevronUpIcon"], {
                    "data-slot": "accordion-trigger-icon",
                    className: "pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
                }, void 0, false, {
                    fileName: "[project]/components/ui/accordion.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/accordion.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/accordion.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_c2 = AccordionTrigger;
function AccordionContent({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$index$2e$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Accordion$3e$__["Accordion"].Panel, {
        "data-slot": "accordion-content",
        className: "overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cn$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["cn"])("h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4", className),
            children: children
        }, void 0, false, {
            fileName: "[project]/components/ui/accordion.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/accordion.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_c3 = AccordionContent;
;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Accordion");
__turbopack_context__.k.register(_c1, "AccordionItem");
__turbopack_context__.k.register(_c2, "AccordionTrigger");
__turbopack_context__.k.register(_c3, "AccordionContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/@base-ui/react/accordion/header/AccordionHeader.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccordionHeader",
    ()=>AccordionHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$AccordionItemContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/item/AccordionItemContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/item/stateAttributesMapping.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
const AccordionHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function AccordionHeader(componentProps, forwardedRef) {
    const { render, className, style, ...elementProps } = componentProps;
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$AccordionItemContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccordionItemContext"])();
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('h3', componentProps, {
        state,
        ref: forwardedRef,
        props: elementProps,
        stateAttributesMapping: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["accordionStateAttributesMapping"]
    });
    return element;
});
if ("TURBOPACK compile-time truthy", 1) AccordionHeader.displayName = "AccordionHeader";
}),
"[project]/node_modules/@base-ui/react/accordion/index.parts.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$header$2f$AccordionHeader$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionHeader"],
    "Item",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$AccordionItem$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionItem"],
    "Panel",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$panel$2f$AccordionPanel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionPanel"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$root$2f$AccordionRoot$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionRoot"],
    "Trigger",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$trigger$2f$AccordionTrigger$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionTrigger"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$index$2e$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/index.parts.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$root$2f$AccordionRoot$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/root/AccordionRoot.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$AccordionItem$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/item/AccordionItem.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$header$2f$AccordionHeader$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/header/AccordionHeader.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$trigger$2f$AccordionTrigger$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/trigger/AccordionTrigger.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$panel$2f$AccordionPanel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/panel/AccordionPanel.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/@base-ui/react/accordion/index.parts.mjs [app-client] (ecmascript) <export * as Accordion>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Accordion",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$index$2e$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$index$2e$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/index.parts.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/@base-ui/react/accordion/index.parts.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
}),
"[project]/node_modules/@base-ui/react/accordion/item/AccordionItem.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccordionItem",
    ()=>AccordionItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useBaseUiId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/useBaseUiId.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$root$2f$useCollapsibleRoot$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/collapsible/root/useCollapsibleRoot.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$root$2f$CollapsibleRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/collapsible/root/CollapsibleRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$composite$2f$list$2f$useCompositeListItem$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/composite/list/useCompositeListItem.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$root$2f$AccordionRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/root/AccordionRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$AccordionItemContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/item/AccordionItemContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/item/stateAttributesMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
const AccordionItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function AccordionItem(componentProps, forwardedRef) {
    const { className, disabled: disabledProp = false, onOpenChange: onOpenChangeProp, render, value: valueProp, style, ...elementProps } = componentProps;
    const { ref: listItemRef, index } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$composite$2f$list$2f$useCompositeListItem$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCompositeListItem"])();
    const { disabled: contextDisabled, handleValueChange, state: rootState, value: openValues } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$root$2f$AccordionRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccordionRootContext"])();
    const fallbackValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useBaseUiId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBaseUiId"])();
    const value = valueProp ?? fallbackValue;
    const disabled = disabledProp || contextDisabled;
    const isOpen = openValues.includes(value);
    const onOpenChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "AccordionItem.AccordionItem.useStableCallback[onOpenChange]": (nextOpen, eventDetails)=>{
            onOpenChangeProp?.(nextOpen, eventDetails);
            if (eventDetails.isCanceled) {
                return;
            }
            handleValueChange(value, nextOpen, eventDetails);
        }
    }["AccordionItem.AccordionItem.useStableCallback[onOpenChange]"]);
    const collapsible = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$root$2f$useCollapsibleRoot$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCollapsibleRoot"])({
        open: isOpen,
        onOpenChange,
        disabled
    });
    const collapsibleContext = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AccordionItem.AccordionItem.useMemo[collapsibleContext]": ()=>({
                ...collapsible,
                onOpenChange,
                state: {
                    open: collapsible.open,
                    disabled: collapsible.disabled,
                    transitionStatus: collapsible.transitionStatus
                }
            })
    }["AccordionItem.AccordionItem.useMemo[collapsibleContext]"], [
        collapsible,
        onOpenChange
    ]);
    const state = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AccordionItem.AccordionItem.useMemo[state]": ()=>({
                ...rootState,
                hidden: !isOpen && !collapsible.mounted,
                index,
                disabled,
                open: isOpen
            })
    }["AccordionItem.AccordionItem.useMemo[state]"], [
        collapsible.mounted,
        disabled,
        index,
        isOpen,
        rootState
    ]);
    const defaultTriggerId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useBaseUiId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBaseUiId"])();
    // `undefined` uses the initial generated fallback; `null` means the trigger unmounted.
    const [registeredTriggerId, setTriggerId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]();
    const triggerId = registeredTriggerId === null ? undefined : registeredTriggerId ?? defaultTriggerId;
    const accordionItemContext = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AccordionItem.AccordionItem.useMemo[accordionItemContext]": ()=>({
                defaultTriggerId,
                open: isOpen,
                state,
                setTriggerId,
                triggerId
            })
    }["AccordionItem.AccordionItem.useMemo[accordionItemContext]"], [
        defaultTriggerId,
        isOpen,
        state,
        setTriggerId,
        triggerId
    ]);
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        state,
        ref: [
            forwardedRef,
            listItemRef
        ],
        props: elementProps,
        stateAttributesMapping: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["accordionStateAttributesMapping"]
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$root$2f$CollapsibleRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleRootContext"].Provider, {
        value: collapsibleContext,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$AccordionItemContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionItemContext"].Provider, {
            value: accordionItemContext,
            children: element
        })
    });
});
if ("TURBOPACK compile-time truthy", 1) AccordionItem.displayName = "AccordionItem";
}),
"[project]/node_modules/@base-ui/react/accordion/item/AccordionItemContext.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccordionItemContext",
    ()=>AccordionItemContext,
    "useAccordionItemContext",
    ()=>useAccordionItemContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const AccordionItemContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
if ("TURBOPACK compile-time truthy", 1) AccordionItemContext.displayName = "AccordionItemContext";
function useAccordionItemContext() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](AccordionItemContext);
    if (context === undefined) {
        throw new Error(("TURBOPACK compile-time truthy", 1) ? 'Base UI: AccordionItemContext is missing. Accordion parts must be placed within <Accordion.Item>.' : "TURBOPACK unreachable");
    }
    return context;
}
}),
"[project]/node_modules/@base-ui/react/accordion/item/AccordionItemDataAttributes.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Indicates the index of the accordion item.
 * @type {number}
 */ __turbopack_context__.s([
    "disabled",
    ()=>disabled,
    "index",
    ()=>index,
    "open",
    ()=>open
]);
const index = 'data-index';
const disabled = 'data-disabled';
const open = 'data-open';
}),
"[project]/node_modules/@base-ui/react/accordion/item/stateAttributesMapping.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "accordionStateAttributesMapping",
    ()=>accordionStateAttributesMapping
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$collapsibleOpenStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/utils/collapsibleOpenStateMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/stateAttributesMapping.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$AccordionItemDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/item/AccordionItemDataAttributes.mjs [app-client] (ecmascript)");
;
;
;
const accordionStateAttributesMapping = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$collapsibleOpenStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collapsibleOpenStateMapping"],
    index: (value)=>({
            [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$AccordionItemDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["index"]]: String(value)
        }),
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["transitionStatusMapping"],
    value: ()=>null
};
}),
"[project]/node_modules/@base-ui/react/accordion/panel/AccordionPanel.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccordionPanel",
    ()=>AccordionPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$warn$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/warn.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$resolveStyle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/utils/resolveStyle.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$root$2f$CollapsibleRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/collapsible/root/CollapsibleRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$panel$2f$useCollapsiblePanel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/collapsible/panel/useCollapsiblePanel.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$root$2f$AccordionRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/root/AccordionRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$AccordionItemContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/item/AccordionItemContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/item/stateAttributesMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$panel$2f$AccordionPanelCssVars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/panel/AccordionPanelCssVars.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
const AccordionPanel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function AccordionPanel(componentProps, forwardedRef) {
    const { className, hiddenUntilFound: hiddenUntilFoundProp, keepMounted: keepMountedProp, id: idProp, render, style, ...elementProps } = componentProps;
    const { hiddenUntilFound: contextHiddenUntilFound, keepMounted: contextKeepMounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$root$2f$AccordionRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccordionRootContext"])();
    const { defaultPanelId, mounted, onOpenChange, open, setMounted, setOpen, setPanelIdState, transitionStatus } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$root$2f$CollapsibleRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCollapsibleRootContext"])();
    const hiddenUntilFound = hiddenUntilFoundProp ?? contextHiddenUntilFound;
    const keepMounted = keepMountedProp ?? contextKeepMounted;
    const registeredId = idProp || undefined;
    const id = idProp ?? defaultPanelId;
    /* istanbul ignore else -- `process.env.NODE_ENV` is a build-time constant under test */ if ("TURBOPACK compile-time truthy", 1) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
            "AccordionPanel.AccordionPanel.useEffect": ()=>{
                if (keepMountedProp === false && hiddenUntilFound) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$warn$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["warn"])('The `keepMounted={false}` prop on an `Accordion.Panel` is ignored when `hiddenUntilFound` is enabled on the panel or root, since the panel must remain mounted while closed.');
                }
            }
        }["AccordionPanel.AccordionPanel.useEffect"], [
            hiddenUntilFound,
            keepMountedProp
        ]);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "AccordionPanel.AccordionPanel.useIsoLayoutEffect": ()=>{
            setPanelIdState({
                "AccordionPanel.AccordionPanel.useIsoLayoutEffect": (currentId)=>registeredId ?? (currentId === null ? undefined : currentId)
            }["AccordionPanel.AccordionPanel.useIsoLayoutEffect"]);
            return ({
                "AccordionPanel.AccordionPanel.useIsoLayoutEffect": ()=>{
                    setPanelIdState({
                        "AccordionPanel.AccordionPanel.useIsoLayoutEffect": (currentId)=>currentId === registeredId ? null : currentId
                    }["AccordionPanel.AccordionPanel.useIsoLayoutEffect"]);
                }
            })["AccordionPanel.AccordionPanel.useIsoLayoutEffect"];
        }
    }["AccordionPanel.AccordionPanel.useIsoLayoutEffect"], [
        registeredId,
        setPanelIdState
    ]);
    const { height, props, ref, shouldPreventOpenAnimation, shouldRender, transitionStatus: panelTransitionStatus, width } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$panel$2f$useCollapsiblePanel$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCollapsiblePanel"])({
        externalRef: forwardedRef,
        hiddenUntilFound,
        id,
        keepMounted,
        mounted,
        onOpenChange,
        open,
        setMounted,
        setOpen,
        transitionStatus
    });
    const { state, triggerId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$AccordionItemContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccordionItemContext"])();
    const panelState = {
        ...state,
        transitionStatus: panelTransitionStatus
    };
    const resolvedStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$resolveStyle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveStyle"])(style, panelState);
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', {
        ...componentProps,
        style: undefined
    }, {
        state: panelState,
        ref,
        props: [
            props,
            {
                'aria-labelledby': triggerId,
                role: 'region',
                style: {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$panel$2f$AccordionPanelCssVars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["accordionPanelHeight"]]: height === undefined ? 'auto' : `${height}px`,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$panel$2f$AccordionPanelCssVars$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["accordionPanelWidth"]]: width === undefined ? 'auto' : `${width}px`
                }
            },
            elementProps,
            resolvedStyle ? {
                style: resolvedStyle
            } : undefined,
            // Resolve the public `style` prop so temporary `animationName: 'none'`
            // can still win after user's inline styles have been merged.
            shouldPreventOpenAnimation ? {
                style: {
                    animationName: 'none'
                }
            } : undefined
        ],
        stateAttributesMapping: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["accordionStateAttributesMapping"]
    });
    if (!shouldRender) {
        return null;
    }
    return element;
});
if ("TURBOPACK compile-time truthy", 1) AccordionPanel.displayName = "AccordionPanel";
}),
"[project]/node_modules/@base-ui/react/accordion/panel/AccordionPanelCssVars.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * The accordion panel's height.
 * @type {number}
 */ __turbopack_context__.s([
    "accordionPanelHeight",
    ()=>accordionPanelHeight,
    "accordionPanelWidth",
    ()=>accordionPanelWidth
]);
const accordionPanelHeight = '--accordion-panel-height';
const accordionPanelWidth = '--accordion-panel-width';
}),
"[project]/node_modules/@base-ui/react/accordion/root/AccordionRoot.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccordionRoot",
    ()=>AccordionRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useControlled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/useControlled.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$warn$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/warn.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/empty.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$composite$2f$list$2f$CompositeList$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/composite/list/CompositeList.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$root$2f$AccordionRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/root/AccordionRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
const rootStateAttributesMapping = {
    value: ()=>null
};
const AccordionRoot = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function AccordionRoot(componentProps, forwardedRef) {
    const { render, className, disabled = false, hiddenUntilFound: hiddenUntilFoundProp, keepMounted: keepMountedProp, loopFocus, onValueChange, multiple = false, orientation = 'vertical', value: valueProp, defaultValue: defaultValueProp, style, ...elementProps } = componentProps;
    const defaultValue = defaultValueProp ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_ARRAY"];
    /* istanbul ignore else -- `process.env.NODE_ENV` is a build-time constant under test */ if ("TURBOPACK compile-time truthy", 1) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
            "AccordionRoot.AccordionRoot.useEffect": ()=>{
                if (hiddenUntilFoundProp && keepMountedProp === false) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$warn$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["warn"])('The `keepMounted={false}` prop on `Accordion.Root` is ignored when `hiddenUntilFound` is enabled, since panels must remain mounted while closed.');
                }
            }
        }["AccordionRoot.AccordionRoot.useEffect"], [
            hiddenUntilFoundProp,
            keepMountedProp
        ]);
    }
    const accordionItemRefs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]([]);
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useControlled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControlled"])({
        controlled: valueProp,
        default: defaultValue,
        name: 'Accordion',
        state: 'value'
    });
    const handleValueChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "AccordionRoot.AccordionRoot.useStableCallback[handleValueChange]": (newValue, nextOpen, details)=>{
            let nextValue;
            if (!multiple) {
                nextValue = value[0] === newValue ? [] : [
                    newValue
                ];
            } else if (nextOpen) {
                // Not `concat`: an item value can itself be an array, which `concat` would flatten.
                nextValue = [
                    ...value,
                    newValue
                ];
            } else {
                nextValue = value.filter({
                    "AccordionRoot.AccordionRoot.useStableCallback[handleValueChange]": (v)=>v !== newValue
                }["AccordionRoot.AccordionRoot.useStableCallback[handleValueChange]"]);
            }
            onValueChange?.(nextValue, details);
            if (details.isCanceled) {
                return;
            }
            setValue(nextValue);
        }
    }["AccordionRoot.AccordionRoot.useStableCallback[handleValueChange]"]);
    const state = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AccordionRoot.AccordionRoot.useMemo[state]": ()=>({
                value,
                disabled,
                orientation
            })
    }["AccordionRoot.AccordionRoot.useMemo[state]"], [
        value,
        disabled,
        orientation
    ]);
    const contextValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AccordionRoot.AccordionRoot.useMemo[contextValue]": ()=>({
                disabled,
                handleValueChange,
                hiddenUntilFound: hiddenUntilFoundProp ?? false,
                keepMounted: keepMountedProp ?? false,
                state,
                value
            })
    }["AccordionRoot.AccordionRoot.useMemo[contextValue]"], [
        disabled,
        handleValueChange,
        hiddenUntilFoundProp,
        keepMountedProp,
        state,
        value
    ]);
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        state,
        ref: forwardedRef,
        props: elementProps,
        stateAttributesMapping: rootStateAttributesMapping
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$root$2f$AccordionRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionRootContext"].Provider, {
        value: contextValue,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$composite$2f$list$2f$CompositeList$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CompositeList"], {
            elementsRef: accordionItemRefs,
            children: element
        })
    });
});
if ("TURBOPACK compile-time truthy", 1) AccordionRoot.displayName = "AccordionRoot";
}),
"[project]/node_modules/@base-ui/react/accordion/root/AccordionRootContext.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccordionRootContext",
    ()=>AccordionRootContext,
    "useAccordionRootContext",
    ()=>useAccordionRootContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const AccordionRootContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
if ("TURBOPACK compile-time truthy", 1) AccordionRootContext.displayName = "AccordionRootContext";
function useAccordionRootContext() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](AccordionRootContext);
    if (context === undefined) {
        throw new Error(("TURBOPACK compile-time truthy", 1) ? 'Base UI: AccordionRootContext is missing. Accordion parts must be placed within <Accordion.Root>.' : "TURBOPACK unreachable");
    }
    return context;
}
}),
"[project]/node_modules/@base-ui/react/accordion/trigger/AccordionTrigger.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccordionTrigger",
    ()=>AccordionTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$collapsibleOpenStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/utils/collapsibleOpenStateMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$use$2d$button$2f$useButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/use-button/useButton.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$root$2f$CollapsibleRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/collapsible/root/CollapsibleRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$AccordionItemContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/item/AccordionItemContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/accordion/item/stateAttributesMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
const stateAttributesMapping = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["accordionStateAttributesMapping"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$collapsibleOpenStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["triggerOpenStateMapping"]
};
const AccordionTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function AccordionTrigger(componentProps, forwardedRef) {
    const { disabled: disabledProp, className, id: idProp, render, nativeButton = true, style, ...elementProps } = componentProps;
    const { panelId, open, handleTrigger, disabled: contextDisabled } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$root$2f$CollapsibleRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCollapsibleRootContext"])();
    const disabled = disabledProp || contextDisabled;
    const { getButtonProps, buttonRef } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$use$2d$button$2f$useButton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useButton"])({
        disabled,
        native: nativeButton
    });
    const { defaultTriggerId, state, setTriggerId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$accordion$2f$item$2f$AccordionItemContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccordionItemContext"])();
    const registeredId = idProp || undefined;
    const id = registeredId ?? defaultTriggerId;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "AccordionTrigger.AccordionTrigger.useIsoLayoutEffect": ()=>{
            setTriggerId({
                "AccordionTrigger.AccordionTrigger.useIsoLayoutEffect": (currentId)=>registeredId ?? (currentId === null ? undefined : currentId)
            }["AccordionTrigger.AccordionTrigger.useIsoLayoutEffect"]);
            return ({
                "AccordionTrigger.AccordionTrigger.useIsoLayoutEffect": ()=>{
                    setTriggerId({
                        "AccordionTrigger.AccordionTrigger.useIsoLayoutEffect": (currentId)=>currentId === registeredId ? null : currentId
                    }["AccordionTrigger.AccordionTrigger.useIsoLayoutEffect"]);
                }
            })["AccordionTrigger.AccordionTrigger.useIsoLayoutEffect"];
        }
    }["AccordionTrigger.AccordionTrigger.useIsoLayoutEffect"], [
        registeredId,
        setTriggerId
    ]);
    const props = {
        'aria-controls': open ? panelId : undefined,
        'aria-expanded': open,
        id,
        onClick: handleTrigger
    };
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('button', componentProps, {
        state,
        ref: [
            forwardedRef,
            buttonRef
        ],
        props: [
            props,
            elementProps,
            getButtonProps
        ],
        stateAttributesMapping
    });
    return element;
});
if ("TURBOPACK compile-time truthy", 1) AccordionTrigger.displayName = "AccordionTrigger";
}),
"[project]/node_modules/@base-ui/react/collapsible/panel/CollapsiblePanelDataAttributes.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "closed",
    ()=>closed,
    "endingStyle",
    ()=>endingStyle,
    "open",
    ()=>open,
    "startingStyle",
    ()=>startingStyle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$TransitionStatusDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__TransitionStatusDataAttributes$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/TransitionStatusDataAttributes.mjs [app-client] (ecmascript) <export * as TransitionStatusDataAttributes>");
;
const open = 'data-open';
const closed = 'data-closed';
const startingStyle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$TransitionStatusDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__TransitionStatusDataAttributes$3e$__["TransitionStatusDataAttributes"].startingStyle;
const endingStyle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$TransitionStatusDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__TransitionStatusDataAttributes$3e$__["TransitionStatusDataAttributes"].endingStyle;
}),
"[project]/node_modules/@base-ui/react/collapsible/panel/useCollapsiblePanel.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCollapsiblePanel",
    ()=>useCollapsiblePanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$addEventListener$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/addEventListener.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useMergedRefs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/useMergedRefs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useAnimationFrame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/useAnimationFrame.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useTimeout$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/useTimeout.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useValueAsRef$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/useValueAsRef.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$warn$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/warn.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWindow__as__ownerWindow$3e$__ = __turbopack_context__.i("[project]/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript) <export getWindow as ownerWindow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/reason-parts.mjs [app-client] (ecmascript) <export * as REASONS>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useOpenChangeComplete$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/useOpenChangeComplete.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useAnimationsFinished$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/useAnimationsFinished.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$panel$2f$CollapsiblePanelDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/collapsible/panel/CollapsiblePanelDataAttributes.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const EMPTY_DIMENSIONS = {
    height: undefined,
    width: undefined
};
function useCollapsiblePanel(parameters) {
    const { externalRef, hiddenUntilFound, id: idParam, keepMounted, mounted, onOpenChange, open, setMounted, setOpen, transitionStatus } = parameters;
    const panelRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const animationTypeRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const [dimensions, setDimensionsUnwrapped] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](EMPTY_DIMENSIONS);
    const lastMeasuredDimensionsRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](EMPTY_DIMENSIONS);
    // `beforematch` should reveal the matched content immediately, so the next
    // open cycle skips author-defined motion once and then returns to normal.
    const shouldSkipNextOpenRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    // Keyframe mount animations on initially open panels cause a visible layout
    // shift during the server-rendered first paint, so suppress that first open
    // lifecycle until the panel has been closed once.
    const shouldPreventMountAnimationRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](open);
    // React.Activity tears down Effects while preserving state, so revealing an
    // already-open panel would otherwise replay its CSS keyframe open animation.
    const shouldPreventActivityResumeAnimationRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    // Some open paths intentionally bypass motion, but the shared root transition
    // status still advances asynchronously. Override the panel to idle so its data
    // attributes and dimension cleanup reflect the immediate open state.
    const [forcePanelIdle, setForcePanelIdle] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const pendingTemporaryStyleRestoreRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const mergedPanelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useMergedRefs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMergedRefs"])(externalRef, panelRef);
    const latestOpenRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useValueAsRef$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useValueAsRef"])(open);
    // Only used to handle panel close
    const runOnceCloseAnimationsFinish = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useAnimationsFinished$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnimationsFinished"])(panelRef);
    const hidden = !open && !mounted;
    const panelTransitionStatus = forcePanelIdle ? 'idle' : transitionStatus;
    const shouldPreventOpenAnimation = open && (// These 2 refs are safe to read in render, they are only written from committed
    // layout/effect paths and gate one-shot motion suppression for the next open
    // lifecycle. They intentionally expose the last committed motion snapshot.
    shouldPreventMountAnimationRef.current || shouldPreventActivityResumeAnimationRef.current);
    const renderedDimensions = !open && mounted && // These 2 refs are also safe to read in render, both hold the last committed
    // animation mode and measurement. This fallback only restores a previously
    // measured pixel size after the live dimensions state has been reset back to `auto`.
    animationTypeRef.current === 'css-animation' && dimensions.height === undefined && dimensions.width === undefined ? lastMeasuredDimensionsRef.current : dimensions;
    const shouldPersistHiddenTransitionStyles = hiddenUntilFound && hidden && animationTypeRef.current !== 'css-animation';
    // Most measured dimensions are reused later when CSS keyframe closes need a
    // pixel size after the rendered dimensions have been reset back to `auto`.
    // Passing `false` is only for clearing the current dimensions state.
    const setDimensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useCollapsiblePanel.useStableCallback[setDimensions]": (nextDimensions, shouldCacheMeasurement = true)=>{
            if (shouldCacheMeasurement) {
                lastMeasuredDimensionsRef.current = nextDimensions;
            }
            setDimensionsUnwrapped(nextDimensions);
        }
    }["useCollapsiblePanel.useStableCallback[setDimensions]"]);
    const restorePendingTemporaryStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useCollapsiblePanel.useStableCallback[restorePendingTemporaryStyle]": ()=>{
            pendingTemporaryStyleRestoreRef.current?.();
            pendingTemporaryStyleRestoreRef.current = null;
        }
    }["useCollapsiblePanel.useStableCallback[restorePendingTemporaryStyle]"]);
    const setPendingTemporaryStyleRestore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useCollapsiblePanel.useStableCallback[setPendingTemporaryStyleRestore]": (restore)=>{
            restorePendingTemporaryStyle();
            pendingTemporaryStyleRestoreRef.current = ({
                "useCollapsiblePanel.useStableCallback[setPendingTemporaryStyleRestore]": ()=>{
                    pendingTemporaryStyleRestoreRef.current = null;
                    restore();
                }
            })["useCollapsiblePanel.useStableCallback[setPendingTemporaryStyleRestore]"];
        }
    }["useCollapsiblePanel.useStableCallback[setPendingTemporaryStyleRestore]"]);
    // React.Activity unmounts Effects while preserving component state. If that
    // teardown happens while an already-open keyframe panel is visible, remember
    // to suppress the replayed open animation on the next committed reveal.
    const markActivityResumeAnimationSuppressed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useCollapsiblePanel.useStableCallback[markActivityResumeAnimationSuppressed]": ()=>{
            if (open && mounted && animationTypeRef.current === 'css-animation') {
                shouldPreventActivityResumeAnimationRef.current = true;
            }
        }
    }["useCollapsiblePanel.useStableCallback[markActivityResumeAnimationSuppressed]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "useCollapsiblePanel.useIsoLayoutEffect": ()=>{
            // `forcePanelIdle` is only a temporary override for open paths that skip
            // motion. Keep it active while the shared root still reports `starting`,
            // then drop it once the root transition state catches up.
            if (!forcePanelIdle || transitionStatus === 'starting') {
                return;
            }
            setForcePanelIdle(false);
        }
    }["useCollapsiblePanel.useIsoLayoutEffect"], [
        forcePanelIdle,
        transitionStatus
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useCollapsiblePanel.useEffect": ()=>{
            return ({
                "useCollapsiblePanel.useEffect": ()=>{
                    markActivityResumeAnimationSuppressed();
                    restorePendingTemporaryStyle();
                }
            })["useCollapsiblePanel.useEffect"];
        }
    }["useCollapsiblePanel.useEffect"], [
        markActivityResumeAnimationSuppressed,
        restorePendingTemporaryStyle
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "useCollapsiblePanel.useIsoLayoutEffect": ()=>{
            // A render function can remove the panel on close. Clear one-shot open animation
            // suppression even without an element, so the next open animates normally.
            if (!open) {
                shouldPreventMountAnimationRef.current = false;
                shouldPreventActivityResumeAnimationRef.current = false;
            }
            const panel = panelRef.current;
            if (!panel) {
                return undefined;
            }
            // `beforematch` can temporarily force a `0s` motion duration so the matched
            // content reveals immediately. Restore the authored duration before detecting
            // the next close animation type, otherwise that first close is misread as
            // "no motion" and the close transition or keyframe gets skipped.
            if (!open && pendingTemporaryStyleRestoreRef.current) {
                restorePendingTemporaryStyle();
            }
            const animationType = getAnimationType(panel, shouldPreventOpenAnimation);
            animationTypeRef.current = animationType;
            // Initially open keyframe panels skip their first paint animation to avoid
            // layout shift, but we still need to cache the expanded size so the first
            // close animation can start from pixels instead of `auto`.
            if (open && transitionStatus === 'idle' && shouldPreventMountAnimationRef.current && animationType === 'css-animation') {
                lastMeasuredDimensionsRef.current = getDimensions(panel);
                return undefined;
            }
            // Handle the opening pass: measure the expanded size and, when necessary,
            // neutralize author-defined motion so the panel can open immediately.
            if (open && transitionStatus === 'starting') {
                // `beforematch` opens should reveal the panel immediately so find-in-page
                // does not wait for the author-defined transition or animation to finish.
                const skipNextOpen = shouldSkipNextOpenRef.current;
                shouldSkipNextOpenRef.current = false;
                if (animationType === 'none') {
                    setDimensions(getDimensions(panel));
                    setForcePanelIdle(true);
                    return undefined;
                }
                if (animationType === 'css-transition') {
                    const restoreLayoutStyles = resetLayoutStyles(panel);
                    setDimensions(getDimensions(panel));
                    if (!skipNextOpen) {
                        return restoreLayoutStyles;
                    }
                    const restoreTransitionDuration = setTemporaryStyle(panel, 'transition-duration', '0s');
                    setPendingTemporaryStyleRestore(restoreTransitionDuration);
                    setForcePanelIdle(true);
                    return restoreLayoutStyles;
                }
                setDimensions(getDimensions(panel));
                const restoreAnimationName = setTemporaryStyle(panel, 'animation-name', 'none');
                if (!skipNextOpen) {
                    restoreAnimationName();
                    return undefined;
                }
                const restoreAnimationDuration = setTemporaryStyle(panel, 'animation-duration', '0s');
                restoreAnimationName();
                setPendingTemporaryStyleRestore(restoreAnimationDuration);
                setForcePanelIdle(true);
                return undefined;
            }
            // Capture the current size as soon as close is requested, before the
            // deferred ending phase applies closed styles. This keeps close transitions
            // starting from a measured pixel value, including interrupted opens.
            if (!open && mounted && (transitionStatus === 'idle' || transitionStatus === 'starting')) {
                if (animationType === 'none') {
                    setDimensions(EMPTY_DIMENSIONS, false);
                    setMounted(false);
                    return undefined;
                }
                setDimensions(getDimensions(panel));
                return undefined;
            }
            if (transitionStatus !== 'ending') {
                return undefined;
            }
            // Reachable when `transitionStatus` already flipped to `ending` before this effect ran, so
            // the close branch above was skipped. Without motion there is nothing to wait for, so unmount
            // here instead of deferring to the animation-finished path below.
            if (animationType === 'none') {
                setMounted(false);
                return undefined;
            }
            const nextDimensions = getDimensions(panel);
            const hasMeasuredSize = nextDimensions.height > 0 || nextDimensions.width > 0;
            if (!hasMeasuredSize) {
                setMounted(false);
                return undefined;
            }
            setDimensions(nextDimensions);
            if (animationType === 'css-animation') {
                const restoreAnimationName = setTemporaryStyle(panel, 'animation-name', 'none');
                restoreAnimationName();
            }
            return undefined;
        }
    }["useCollapsiblePanel.useIsoLayoutEffect"], [
        mounted,
        open,
        restorePendingTemporaryStyle,
        setDimensions,
        setMounted,
        setPendingTemporaryStyleRestore,
        shouldPreventOpenAnimation,
        transitionStatus
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useOpenChangeComplete$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOpenChangeComplete"])({
        enabled: open && mounted && panelTransitionStatus === 'idle',
        open: true,
        ref: panelRef,
        onComplete () {
            // `useOpenChangeComplete` only aborts from its effect cleanup, which React runs in the
            // post-paint passive flush. An animation's `finished` microtask can resolve after the render
            // that set `open` to `false` but before that cleanup, so re-check the latest value here.
            // Clearing the measured size in that window would make the close transition start from
            // `height: 0` instead of the expanded pixel height.
            if (!open) {
                return;
            }
            setDimensions(EMPTY_DIMENSIONS, false);
        }
    });
    // Closing panels need extra sequencing beyond `useOpenChangeComplete`.
    // This passive effect runs after the `ending` render has committed, so
    // `[data-ending-style]` is already present. Chrome can still register the
    // exit transition one frame later when an Accordion closes one item while
    // opening another, so wait one frame before watching animations.
    // See https://github.com/mui/base-ui/issues/3099
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useCollapsiblePanel.useEffect": ()=>{
            if (open || !mounted || panelTransitionStatus !== 'ending') {
                return undefined;
            }
            const panel = panelRef.current;
            if (!panel) {
                // A render function can drop the panel element while it closes. There is nothing left
                // to animate, so finish closing instead of staying in the ending phase.
                setMounted(false);
                setDimensions(EMPTY_DIMENSIONS, false);
                return undefined;
            }
            const abortController = new AbortController();
            let endingStyleFrame = -1;
            function handleComplete() {
                // Same post-paint race as the `useOpenChangeComplete` callback above, except `open` is
                // captured by this effect's closure and always `false` here, so read the latest value from
                // a ref. Unmounting a panel that has already reopened would drop it from the DOM.
                if (latestOpenRef.current) {
                    return;
                }
                setMounted(false);
                setDimensions(EMPTY_DIMENSIONS, false);
            }
            endingStyleFrame = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useAnimationFrame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimationFrame"].request({
                "useCollapsiblePanel.useEffect": ()=>{
                    runOnceCloseAnimationsFinish(handleComplete, abortController.signal);
                }
            }["useCollapsiblePanel.useEffect"]);
            return ({
                "useCollapsiblePanel.useEffect": ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useAnimationFrame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimationFrame"].cancel(endingStyleFrame);
                    abortController.abort();
                }
            })["useCollapsiblePanel.useEffect"];
        }
    }["useCollapsiblePanel.useEffect"], [
        latestOpenRef,
        mounted,
        open,
        panelTransitionStatus,
        runOnceCloseAnimationsFinish,
        setDimensions,
        setMounted
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "useCollapsiblePanel.useIsoLayoutEffect": ()=>{
            const panel = panelRef.current;
            if (!panel || !hiddenUntilFound || !hidden) {
                return;
            }
            // React only supports a boolean for the `hidden` attribute and forces
            // legit string values to booleans so we have to force it back in the DOM
            // when necessary: https://github.com/react/react/issues/24740
            panel.setAttribute('hidden', 'until-found');
        }
    }["useCollapsiblePanel.useIsoLayoutEffect"], [
        hidden,
        hiddenUntilFound
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"](function registerBeforeMatchListener() {
        const panel = panelRef.current;
        if (!panel) {
            return undefined;
        }
        const revealDecisionTimeout = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useTimeout$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timeout"].create();
        let revertRevealFrame = -1;
        // Reverting must wait until the browser has measured the match, and React
        // cannot do it: it keeps rendering the same `hidden` and `data-starting-style`
        // props while the panel stays closed, so it never rewrites attributes that were
        // changed behind its back (the browser removes `hidden` as part of the reveal).
        //
        // Whether the open arrived is decided in a task, not a frame: `setOpen` has
        // already scheduled React's own task by the time the timeout is queued, so the
        // decision drains after the commit even when a busy main thread delays both,
        // whereas a rendering update could preempt the still-queued commit and make an
        // animation frame read a stale value. When the consumer ignores the open, no
        // commit is ever scheduled and the decision holds. The DOM revert then runs
        // in a frame so it stays atomic with respect to paint.
        const scheduleRevealRevert = {
            "useCollapsiblePanel.useEffect.registerBeforeMatchListener.scheduleRevealRevert": (revertSkippedMotion, restoreStartingStyle)=>{
                revealDecisionTimeout.start(0, {
                    "useCollapsiblePanel.useEffect.registerBeforeMatchListener.scheduleRevealRevert": ()=>{
                        if (latestOpenRef.current) {
                            return;
                        }
                        revertRevealFrame = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useAnimationFrame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimationFrame"].request({
                            "useCollapsiblePanel.useEffect.registerBeforeMatchListener.scheduleRevealRevert": ()=>{
                                if (latestOpenRef.current) {
                                    return;
                                }
                                if (revertSkippedMotion) {
                                    // The open never happened, so the next one is an ordinary open that
                                    // should keep its author-defined motion.
                                    shouldSkipNextOpenRef.current = false;
                                }
                                if (restoreStartingStyle) {
                                    panel.setAttribute(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$panel$2f$CollapsiblePanelDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startingStyle"], '');
                                }
                                panel.setAttribute('hidden', 'until-found');
                            }
                        }["useCollapsiblePanel.useEffect.registerBeforeMatchListener.scheduleRevealRevert"]);
                    }
                }["useCollapsiblePanel.useEffect.registerBeforeMatchListener.scheduleRevealRevert"]);
            }
        }["useCollapsiblePanel.useEffect.registerBeforeMatchListener.scheduleRevealRevert"];
        // Declared as a `const` after the null check so `panel` stays narrowed: the
        // handler must touch the same element the listener is attached to.
        const handleBeforeMatch = {
            "useCollapsiblePanel.useEffect.registerBeforeMatchListener.handleBeforeMatch": (event)=>{
                const eventDetails = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none, event);
                onOpenChange(true, eventDetails);
                if (eventDetails.isCanceled) {
                    // A canceled reveal means the panel must stay hidden, so undo the
                    // browser's removal of `hidden` and keep the content searchable.
                    scheduleRevealRevert(false, false);
                    return;
                }
                shouldSkipNextOpenRef.current = true;
                // The browser removes `hidden` and measures the match in the same task that
                // dispatches this event, while the React state update below only lands in a
                // later one. Panels kept collapsed by persisted starting styles would still
                // be zero-sized at that point and the match highlight is dropped, so drop
                // those styles synchronously here.
                const hadStartingStyle = panel.hasAttribute(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$panel$2f$CollapsiblePanelDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startingStyle"]);
                panel.removeAttribute(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$panel$2f$CollapsiblePanelDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startingStyle"]);
                setOpen(true);
                // A controlled panel whose `onOpenChange` is ignored never receives the open
                // state, so return it to the fully closed state once the browser has measured.
                scheduleRevealRevert(true, hadStartingStyle);
            }
        }["useCollapsiblePanel.useEffect.registerBeforeMatchListener.handleBeforeMatch"];
        const cleanupBeforeMatchListener = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$addEventListener$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addEventListener"])(panel, 'beforematch', handleBeforeMatch);
        return ({
            "useCollapsiblePanel.useEffect.registerBeforeMatchListener": ()=>{
                revealDecisionTimeout.clear();
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useAnimationFrame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimationFrame"].cancel(revertRevealFrame);
                cleanupBeforeMatchListener();
            }
        })["useCollapsiblePanel.useEffect.registerBeforeMatchListener"];
    }, [
        latestOpenRef,
        onOpenChange,
        setOpen
    ]);
    const shouldRender = keepMounted || hiddenUntilFound || mounted || open;
    return {
        height: renderedDimensions.height,
        props: {
            ...shouldPersistHiddenTransitionStyles ? {
                [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$panel$2f$CollapsiblePanelDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startingStyle"]]: ''
            } : undefined,
            hidden,
            id: idParam
        },
        ref: mergedPanelRef,
        shouldPreventOpenAnimation,
        shouldRender,
        transitionStatus: panelTransitionStatus,
        width: renderedDimensions.width
    };
}
function getDimensions(element) {
    return {
        height: element.scrollHeight,
        width: element.scrollWidth
    };
}
function getAnimationType(element, hasSuppressedMountAnimation) {
    const panelStyles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWindow__as__ownerWindow$3e$__["ownerWindow"])(element).getComputedStyle(element);
    const hasAnimation = (panelStyles.animationName.split(',').map((name)=>name.trim()).some((name)=>name !== '' && name !== 'none') || hasSuppressedMountAnimation) && hasNonZeroDuration(panelStyles.animationDuration);
    const hasTransition = hasNonZeroDuration(panelStyles.transitionDuration);
    if (hasAnimation && hasTransition) {
        /* istanbul ignore else -- `process.env.NODE_ENV` is a build-time constant under test */ if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$warn$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["warn"])('CSS transitions and CSS animations both detected on Collapsible or Accordion panel.', 'Only one of either animation type should be used.');
        }
        return 'css-transition';
    }
    if (hasTransition) {
        return 'css-transition';
    }
    if (hasAnimation) {
        return 'css-animation';
    }
    return 'none';
}
function hasNonZeroDuration(value) {
    return value.split(',').map((part)=>part.trim()).some((part)=>part !== '' && Number.parseFloat(part) > 0);
}
/**
 * Temporarily overrides an inline style property and returns a cleanup that
 * restores the previous inline value and priority.
 * @param element - The element whose inline style should be updated.
 * @param property - The CSS property name to override.
 * @param value - The temporary value to assign.
 * @returns A cleanup function that restores the original inline style state.
 */ function setTemporaryStyle(element, property, value) {
    const previousValue = element.style.getPropertyValue(property);
    const previousPriority = element.style.getPropertyPriority(property);
    element.style.setProperty(property, value);
    return ()=>{
        if (previousValue === '') {
            element.style.removeProperty(property);
            return;
        }
        element.style.setProperty(property, previousValue, previousPriority);
    };
}
/**
 * Temporarily resets inline alignment styles that can distort scroll-based
 * size measurements, then restores them on the next animation frame.
 * @param element - The panel element being measured.
 * @returns A cleanup function that cancels the scheduled restore and reapplies
 * the original inline layout styles immediately.
 */ function resetLayoutStyles(element) {
    const originalLayoutStyles = {
        'justify-content': element.style.justifyContent,
        'align-items': element.style.alignItems,
        'align-content': element.style.alignContent,
        'justify-items': element.style.justifyItems
    };
    Object.keys(originalLayoutStyles).forEach((key)=>{
        element.style.setProperty(key, 'initial', 'important');
    });
    function restoreLayoutStyles() {
        Object.entries(originalLayoutStyles).forEach(([key, value])=>{
            if (value === '') {
                element.style.removeProperty(key);
                return;
            }
            element.style.setProperty(key, value);
        });
    }
    const frame = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useAnimationFrame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimationFrame"].request(restoreLayoutStyles);
    return ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useAnimationFrame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimationFrame"].cancel(frame);
        restoreLayoutStyles();
    };
}
}),
"[project]/node_modules/@base-ui/react/collapsible/root/CollapsibleRootContext.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CollapsibleRootContext",
    ()=>CollapsibleRootContext,
    "useCollapsibleRootContext",
    ()=>useCollapsibleRootContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const CollapsibleRootContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
if ("TURBOPACK compile-time truthy", 1) CollapsibleRootContext.displayName = "CollapsibleRootContext";
function useCollapsibleRootContext() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](CollapsibleRootContext);
    if (context === undefined) {
        throw new Error(("TURBOPACK compile-time truthy", 1) ? 'Base UI: CollapsibleRootContext is missing. Collapsible parts must be placed within <Collapsible.Root>.' : "TURBOPACK unreachable");
    }
    return context;
}
}),
"[project]/node_modules/@base-ui/react/collapsible/root/useCollapsibleRoot.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCollapsibleRoot",
    ()=>useCollapsibleRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useControlled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/useControlled.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useBaseUiId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/useBaseUiId.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/reason-parts.mjs [app-client] (ecmascript) <export * as REASONS>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useTransitionStatus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/internals/useTransitionStatus.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function useCollapsibleRoot(parameters) {
    const { open: openParam, defaultOpen = false, onOpenChange, disabled } = parameters;
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useControlled$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControlled"])({
        controlled: openParam,
        default: defaultOpen,
        name: 'Collapsible',
        state: 'open'
    });
    const { mounted, setMounted, transitionStatus } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useTransitionStatus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransitionStatus"])(open, true, true);
    const defaultPanelId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useBaseUiId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBaseUiId"])();
    // `undefined` uses the initial generated fallback; `null` means the panel unmounted.
    const [registeredPanelId, setPanelIdState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]();
    const panelId = registeredPanelId === null ? undefined : registeredPanelId ?? defaultPanelId;
    const handleTrigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useCollapsibleRoot.useStableCallback[handleTrigger]": (event)=>{
            const nextOpen = !open;
            const eventDetails = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].triggerPress, event.nativeEvent);
            onOpenChange(nextOpen, eventDetails);
            if (eventDetails.isCanceled) {
                return;
            }
            setOpen(nextOpen);
        }
    }["useCollapsibleRoot.useStableCallback[handleTrigger]"]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useCollapsibleRoot.useMemo": ()=>({
                defaultPanelId,
                disabled,
                handleTrigger,
                mounted,
                open,
                panelId,
                setMounted,
                setOpen,
                setPanelIdState,
                transitionStatus
            })
    }["useCollapsibleRoot.useMemo"], [
        defaultPanelId,
        disabled,
        handleTrigger,
        mounted,
        open,
        panelId,
        setMounted,
        setOpen,
        setPanelIdState,
        transitionStatus
    ]);
}
}),
"[project]/node_modules/@base-ui/react/collapsible/trigger/CollapsibleTriggerDataAttributes.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Present when the collapsible panel is open.
 */ __turbopack_context__.s([
    "panelOpen",
    ()=>panelOpen
]);
const panelOpen = 'data-panel-open';
}),
"[project]/node_modules/@base-ui/react/utils/collapsibleOpenStateMapping.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "collapsibleOpenStateMapping",
    ()=>collapsibleOpenStateMapping,
    "triggerOpenStateMapping",
    ()=>triggerOpenStateMapping
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$panel$2f$CollapsiblePanelDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/collapsible/panel/CollapsiblePanelDataAttributes.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$trigger$2f$CollapsibleTriggerDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@base-ui/react/collapsible/trigger/CollapsibleTriggerDataAttributes.mjs [app-client] (ecmascript)");
;
;
const PANEL_OPEN_HOOK = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$panel$2f$CollapsiblePanelDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["open"]]: ''
};
const PANEL_CLOSED_HOOK = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$panel$2f$CollapsiblePanelDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closed"]]: ''
};
const triggerOpenStateMapping = {
    open (value) {
        if (value) {
            return {
                [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$trigger$2f$CollapsibleTriggerDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["panelOpen"]]: ''
            };
        }
        return null;
    }
};
const collapsibleOpenStateMapping = {
    open (value) {
        if (value) {
            return PANEL_OPEN_HOOK;
        }
        return PANEL_CLOSED_HOOK;
    }
};
}),
"[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>ChevronUp
]);
/**
 * @license lucide-react v1.57.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "chevron-up",
    size: 24,
    node: [
        [
            "path",
            {
                d: "m18 15-6-6-6 6",
                key: "153udz"
            }
        ]
    ]
};
__iconData.node;
const ChevronUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.mjs [app-client] (ecmascript) <export default as ChevronUpIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronUpIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.mjs [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_1eu6-e0._.js.map