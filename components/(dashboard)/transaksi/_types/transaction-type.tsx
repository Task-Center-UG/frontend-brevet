export type TTransaction = {
  id: string;
  payment_status:
    | "pending"
    | "waiting_confirmation"
    | "paid"
    | "rejected"
    | "expired"
    | "cancelled";
  user_id: string;
  batch_id: string;
  price_id: string;
  expired_at: string;
  created_at: string;
  updated_at: string;
  payment_proof: string | null;
  unique_code: number;
  transfer_amount: number;
  buyer_bank_account_name: string | null;
  buyer_bank_account_number: string | null;
  buyer_bank_name: string | null;

  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    created_at: string;
    updated_at: string;
    role_type: string;
  };

  batch: {
    id: string;
    course_id: string;
    slug: string;
    title: string;
    description: string;
    batch_thumbnail: string;
    start_at: string;
    end_at: string;
    start_time: string;
    end_time: string;
    room: string;
    quota: number;
    days:
      | {
          id: string;
          batch_id: string;
          day: string;
        }[]
      | null;
    created_at: string;
    updated_at: string;
    course_type: "online" | "offline";
  };

  price: {
    id: string;
    group_type: string;
    price: number;
    updated_at: string;
    created_at: string;
  };
};
