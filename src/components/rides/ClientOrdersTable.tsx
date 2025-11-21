import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Typography,
  TableContainer,
} from "@mui/material";

interface Props {
  rides: any[];
  quotes: any[];
  onDelete: (id: string) => void;
}

const ClientOrdersTable: React.FC<Props> = ({ rides, quotes, onDelete }) => {
  // פונקציה שמחשבת סטטוס בקשה
  const getStatus = (rideId: string) => {
    const rideQuotes = quotes.filter((q: any) => q.rideRequestId?._id === rideId);

    if (rideQuotes.length === 0) return "טרם ניתנו הצעות";

    if (rideQuotes.some((q: any) => q.approved)) return "הצעה אושרה";

    return "הוגשו הצעות הממתינות לאישור";
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }} dir="rtl">
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        ההזמנות שלי
      </Typography>

      {rides.length === 0 ? (
        <Typography>אין בקשות.</Typography>
      ) : (
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>סוג נסיעה</TableCell>
                <TableCell>מוצא</TableCell>
                <TableCell>יעדים</TableCell>
                <TableCell>מקומות</TableCell>
                <TableCell>סטטוס</TableCell>
                <TableCell>פעולות</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rides.map((r: any) => {
                const status = getStatus(r._id);
                return (
                  <TableRow key={r._id}>
                    <TableCell>{r.tripType}</TableCell>
                    <TableCell>{r.origin}</TableCell>
                    <TableCell>{r.destinations.join(" → ")}</TableCell>
                    <TableCell>{r.seats}</TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          color:
                            status === "הצעה אושרה"
                              ? "green"
                              : status === "טרם ניתנו הצעות"
                              ? "gray"
                              : "orange",
                          fontWeight: 600,
                        }}
                      >
                        {status}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Button
                        color="error"
                        disabled={status !== "טרם ניתנו הצעות"}
                        onClick={() => onDelete(r._id)}
                      >
                        מחק בקשה
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default ClientOrdersTable;
