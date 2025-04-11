import CustomButton from "./button/Button";
import styles from "./MainPage.module.css"
import BarChartComponent from "./barChart/BarChart";
import PaiChart from "./paiChart/PaiChart";
import { useEffect, useState } from "react";
import TransactionList from "./transactionTable/TransactionList";
import ExpenseForm from "./expanseForm/ExpanseForm";
import Modal from "./modelWraper/Model";
import AddBalanceForm from "./addBalanceForm/AddBalanceForm";



export default function ExpainseTracker() {

  const [balance, setBalance] = useState(0);
  const [expense, setExpense] = useState(0);
  const [expenseList, setExpenseList] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // To Show & hide the modals
  const [isOpenExpense, setIsOpenExpense] = useState(false);
  const [isOpenBalance, setIsOpenBalance] = useState(false);

  const [categorySpends, setCategorySpends] = useState({
    food: 0,
    entertainment: 0,
    travel: 0,
  });

  // const [categoryCount, setCategoryCount] = useState({
  //   food: 0,
  //   entertainment: 0,
  //   travel: 0,
  // });

  useEffect(() => {
    //To Check the localStorage
    const localBalance = localStorage.getItem("balance");

    if (localBalance) {
      setBalance(Number(localBalance));
    } else {
      setBalance(5000);
      localStorage.setItem("balance", 5000);
    }

    const items = JSON.parse(localStorage.getItem("expenses"));

    setExpenseList(items || []);
    setIsMounted(true);
  }, []);

  // saving expense list in localStorage
  useEffect(() => {
      if (expenseList.length > 0 || isMounted) {
        localStorage.setItem("expenses", JSON.stringify(expenseList));
      }
  
      if (expenseList.length > 0) {
        setExpense(
          expenseList.reduce(
            (accumulator, currentValue) =>
              accumulator + Number(currentValue.price),
            0
          )
        );
      } else {
        setExpense(0);
      }
  
      let foodSpends = 0,
        entertainmentSpends = 0,
        travelSpends = 0;
      // let foodCount = 0,
      //   entertainmentCount = 0,
      //   travelCount = 0;
  
      expenseList.forEach((item) => {
        if (item.category === "food") {
          foodSpends += Number(item.price);
          // foodCount++;
        } else if (item.category === "entertainment") {
          entertainmentSpends += Number(item.price);
          // entertainmentCount++;
        } else if (item.category === "travel") {
          travelSpends += Number(item.price);
          // travelCount++;
        }
      });
  
      setCategorySpends({
        food: foodSpends,
        travel: travelSpends,
        entertainment: entertainmentSpends,
      });
  
      // setCategoryCount({
      //   food: foodCount,
      //   travel: travelCount,
      //   entertainment: entertainmentCount,
      // });
  }, [expenseList, isMounted]);

  // saving balance in localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("balance", balance);
    }
  }, [balance, isMounted]);

  return (
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.red}></div>
          <div className={styles.yellow}></div>
          <div className={styles.green}></div>
        </div>
        <div className={styles.page}>
          <h1>Expense Tracker</h1>
          <div className={styles.card_page}>
            <div className={styles.cards}>
              <div className={styles.card}>
                <h3>Wallet Balance:{" "}
                <span className={styles.success}>
                    {`₹${balance}`}
                </span>
                </h3>
                <CustomButton styler="success" handleClick={() => { setIsOpenBalance(true) }}>+ Add Income</CustomButton>
              </div>
              <div className={styles.card}>
                <h3>Expanses:{" "}
                <span className={styles.failure}>
                    {`₹${expense}`}
                </span>
                </h3>
                <CustomButton styler="failure" handleClick={() => { setIsOpenExpense(true) }}>+ Add Expense</CustomButton>
              </div>
            </div>
            
            <div className={styles.pai_chart}>
              <PaiChart data={[
                { name: "Food", value: categorySpends.food },
                { name: "Entertainment", value: categorySpends.entertainment },
                { name: "Travel", value: categorySpends.travel },
              ]}/>
            </div>
          </div>
          
          <div className={styles.expanse_details}>
              <div className={styles.expanse_list}>
                <TransactionList
                  transactions={expenseList}
                  editTransactions={setExpenseList}
                  title="Recent Transactions"
                  balance={balance}
                  setBalance={setBalance}
                />
              </div>
              <div className={styles.expanse_chart}> 
                <BarChartComponent data={[
                  { name: "Food", value: categorySpends.food },
                  { name: "Entertainment", value: categorySpends.entertainment },
                  { name: "Travel", value: categorySpends.travel },
                ]}/>
              </div>
          </div>
          
        </div>
        <Modal isOpen={isOpenExpense} setIsOpen={setIsOpenExpense}>
          <ExpenseForm
            setIsOpen={setIsOpenExpense}
            expenseList={expenseList}
            setExpenseList={setExpenseList}
            setBalance={setBalance}
            balance={balance}
          />
        </Modal>
        <Modal isOpen={isOpenBalance} setIsOpen={setIsOpenBalance}>
          <AddBalanceForm setIsOpen={setIsOpenBalance} setBalance={setBalance} />
        </Modal>
      </div>
  );
}