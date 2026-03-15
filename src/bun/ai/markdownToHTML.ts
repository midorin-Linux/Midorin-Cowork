export function markdownToHTML(message: string) {
    return Bun.markdown.render(
        message,
        {
            heading: (children, { level }: { level: number }) => {
                const content = Array.isArray(children) ? children.join('') : String(children ?? '');
                const tag = `h${Math.min(Math.max(level, 1), 6)}`;
                const styles: Record<number, string> = {
                    1: 'text-xl font-bold tracking-tight',
                    2: 'text-lg font-semibold tracking-tight',
                    3: 'text-base font-semibold tracking-tight',
                    4: 'text-sm font-semibold tracking-tight',
                    5: 'text-sm font-medium tracking-tight',
                    6: 'text-xs font-medium uppercase tracking-wider text-muted-foreground',
                };
                return `<${tag} class="${styles[level] ?? styles[3]}">${content}</${tag}>`;
            },

            paragraph: children =>
                `<p class="leading-7">${children}</p>`,

            blockquote: children =>
                `<blockquote class="border-l-2 italic">${children}</blockquote>`,

            code: (children, meta) => {
                const language = meta?.language;
                const lang = language ? ` data-language="${language}"` : '';
                const langLabel = language
                    ? `<div class="flex items-center justify-between rounded-t-lg border-b border-border/60 bg-muted/50 text-xs text-muted-foreground"><span>${language}</span></div>`
                    : '';
                return `<div class="overflow-hidden rounded-lg border border-border/60 bg-muted/40">${langLabel}<pre class="overflow-x-auto text-sm leading-relaxed"><code${lang} class="font-mono">${children}</code></pre></div>`;
            },

            list: (children, { ordered, start }: { ordered: boolean; start?: number }) => {
                if (ordered) {
                    const startAttr = start != null && start !== 1 ? ` start="${start}"` : '';
                    return `<ol class="list-decimal"${startAttr}>${children}</ol>`;
                }
                return `<ul class="list-disc">${children}</ul>`;
            },

            listItem: (children, meta) => {
                const checked = meta?.checked;
                if (checked != null) {
                    const checkbox = checked
                        ? '<input type="checkbox" checked disabled class="accent-primary align-middle" />'
                        : '<input type="checkbox" disabled class="align-middle" />';
                    return `<li class="list-none">${checkbox}${children}</li>`;
                }
                return `<li>${children}</li>`;
            },

            hr: () =>
                `<hr class="border-border/50" />`,

            table: children =>
                `<div class="overflow-x-auto rounded-lg border border-border/60"><table class="w-full border-collapse text-sm">${children}</table></div>`,

            thead: children =>
                `<thead class="bg-muted/50">${children}</thead>`,

            tbody: children =>
                `<tbody class="divide-y divide-border/40">${children}</tbody>`,

            tr: children =>
                `<tr class="border-b border-border/40 last:border-0">${children}</tr>`,

            th: (children, meta) => {
                const alignClass = meta?.align ? ` text-${meta.align}` : ' text-left';
                return `<th class="font-medium${alignClass}">${children}</th>`;
            },

            td: (children, meta) => {
                const alignClass = meta?.align ? ` text-${meta.align}` : '';
                return `<td class="${alignClass}">${children}</td>`;
            },

            strong: children =>
                `<strong class="font-semibold">${children}</strong>`,

            emphasis: children =>
                `<em>${children}</em>`,

            link: (children, meta) => {
                const content = Array.isArray(children) ? children.join('') : String(children ?? '');
                const href = meta?.href ?? '#';
                return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2 transition-colors hover:text-primary/80">${content}</a>`;
            },

            image: (_children, meta) => {
                const titleAttr = meta?.title ? ` title="${meta.title}"` : '';
                const alt = Array.isArray(_children) ? _children.join('') : String(_children ?? '');
                const src = meta?.src ?? '';
                return `<img src="${src}" alt="${alt}"${titleAttr} class="max-w-full rounded-lg" loading="lazy" />`;
            },

            codespan: children =>
                `<code class="rounded bg-muted font-mono text-[0.88em]">${children}</code>`,

            strikethrough: children =>
                `<del class="line-through text-muted-foreground">${children}</del>`,
        },
        {
            tables: true,
            strikethrough: true,
            tasklists: true,
            autolinks: true,
        },
    );
}
