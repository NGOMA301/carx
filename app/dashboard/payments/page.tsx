"use client"

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { data } from "./data"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

export type Payment = {
  id: string
  paymentNumber: string
  method: "card" | "paypal" | "stripe"
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  createdAt: Date
}

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "paymentNumber",
    header: "Payment ID",
  },
  {
    accessorKey: "method",
    header: "Method",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
      return <Actions payment={payment} />
    },
  },
]

const Actions = ({ payment }: { payment: Payment }) => {
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null)

  const generateInvoice = async (payment: any) => {
    try {
      setGeneratingInvoice(payment.id)
      // Simulate invoice generation delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const invoiceData = `INVOICE\n\nPayment ID: ${payment.paymentNumber}\nAmount: $${payment.amount}\nDate: ${new Date(payment.createdAt).toLocaleDateString()}\nMethod: ${payment.method}\nStatus: ${payment.status}`

      const blob = new Blob([invoiceData], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${payment.paymentNumber}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to generate invoice:", error)
    } finally {
      setGeneratingInvoice(null)
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => generateInvoice(payment)}
      disabled={generatingInvoice === payment.id}
    >
      {generatingInvoice === payment.id ? (
        <LoadingSpinner size="sm" className="mr-2" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      {generatingInvoice === payment.id ? "Generating..." : "Invoice"}
    </Button>
  )
}

const PaymentsTable = () => {
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default PaymentsTable
