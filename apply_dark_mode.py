import re

with open('src/app/admin/dashboard/DashboardShell.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add ThemeToggle import
if 'import ThemeToggle from "@/components/ThemeToggle";' not in content:
    content = content.replace('import BulkImport from "./BulkImport";', 'import BulkImport from "./BulkImport";\nimport ThemeToggle from "@/components/ThemeToggle";')

# Add ThemeToggle component
if '<ThemeToggle />' not in content:
    content = content.replace('<button onClick={() => setLang(lang === "en" ? "ar" : "en")}', '<ThemeToggle />\n            <button onClick={() => setLang(lang === "en" ? "ar" : "en")}')

# Replacements
content = content.replace('bg-[#F5F5F4]', 'bg-[#F5F5F4] dark:bg-brand-black')

content = content.replace('bg-white border-b border-gray-200 sticky top-0 z-40', 'bg-white dark:bg-brand-gray border-b border-gray-200 dark:border-brand-border/20 sticky top-0 z-40')

content = content.replace('bg-white border-b border-gray-200 overflow-x-auto hidden sm:block', 'bg-white dark:bg-brand-gray border-b border-gray-200 dark:border-brand-border/20 overflow-x-auto hidden sm:block')

content = content.replace('bg-white border-t border-gray-200', 'bg-white dark:bg-brand-gray border-t border-gray-200 dark:border-brand-border/20')

content = content.replace('text-[#1A1A1A]', 'text-brand-black dark:text-offwhite')

content = content.replace('bg-[#1A1A1A] flex items-center justify-center text-white', 'bg-brand-black dark:bg-offwhite dark:text-brand-black flex items-center justify-center text-white')

content = content.replace('border-[#1A1A1A] text-[#1A1A1A]', 'border-brand-black dark:border-offwhite text-brand-black dark:text-offwhite')

content = content.replace('hover:text-[#1A1A1A]', 'hover:text-brand-black dark:hover:text-offwhite')

content = content.replace('bg-white border border-gray-200', 'bg-white dark:bg-brand-gray border border-gray-200 dark:border-brand-border/20')
content = content.replace('bg-white border border-dashed border-gray-200', 'bg-white dark:bg-brand-gray border border-dashed border-gray-200 dark:border-brand-border/20')
content = content.replace('bg-white border rounded-sm p-4', 'bg-white dark:bg-brand-gray border rounded-sm p-4')

content = content.replace('bg-[#1A1A1A] text-white border-[#1A1A1A]', 'bg-brand-black dark:bg-offwhite text-white dark:text-brand-black border-brand-black dark:border-offwhite')
content = content.replace('bg-[#1A1A1A] border-[#1A1A1A]', 'bg-brand-black dark:bg-offwhite border-brand-black dark:border-offwhite')

content = content.replace('text-white', 'text-white') # No-op for now unless explicitly needed

# Add dark mode for border-gray-200 in generic buttons/borders
content = re.sub(r'border border-gray-200(?![ a-zA-Z0-9/-]*dark:border)', 'border border-gray-200 dark:border-brand-border/30', content)

# bg-[#1A1A1A] rounded-full -> bg-brand-black dark:bg-offwhite rounded-full
content = content.replace('bg-[#1A1A1A] rounded-full', 'bg-brand-black dark:bg-offwhite rounded-full')

# <stop offset="5%"  stopColor="#1A1A1A" stopOpacity={0.15} />
# Wait, let's leave Recharts colors alone or just change them? The user didn't mention it, but let's check the user snippet.
# In the user snippet:
# <Area type="monotone" dataKey="profit" name={t("admin.dashboard.financials.chart_labels.profit")} stroke="#1A1A1A" strokeWidth={2} fill="url(#profit-grad)" />
# It stayed #1A1A1A, so chart colors are kept.
# Wait, what about group-hover:bg-[#1A1A1A]?
content = content.replace('group-hover:bg-[#1A1A1A]', 'group-hover:bg-brand-black dark:group-hover:bg-offwhite')
content = content.replace('group-hover:text-white', 'group-hover:text-white dark:group-hover:text-brand-black')

with open('src/app/admin/dashboard/DashboardShell.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
