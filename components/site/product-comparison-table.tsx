import { products } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const compared = products.slice(0, 4);

export function ProductComparisonTable() {
  const rows = [
    ["Категория", (p: typeof products[number]) => p.category],
    ["Состав", (p: typeof products[number]) => p.composition],
    ["Норма внесения", (p: typeof products[number]) => p.dosage],
    ["Культуры", (p: typeof products[number]) => p.crops.join(", ")],
    ["Сезон", (p: typeof products[number]) => p.season],
    ["Фасовка", (p: typeof products[number]) => p.pack],
    ["Цена", (p: typeof products[number]) => formatPrice(p.price)]
  ] as const;

  return (
    <div className="rounded-[8px] border border-white/10 bg-white/[0.06] p-3 md:p-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-40">Параметр</TableHead>
            {compared.map((product) => (
              <TableHead key={product.slug} className="min-w-56 text-white">
                {product.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([label, getValue]) => (
            <TableRow key={label}>
              <TableCell className="font-medium text-emerald-100">{label}</TableCell>
              {compared.map((product) => (
                <TableCell key={product.slug}>{getValue(product)}</TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-medium text-emerald-100">Действие</TableCell>
            {compared.map((product) => (
              <TableCell key={product.slug}>
                <Button size="sm">Запросить предложение</Button>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
