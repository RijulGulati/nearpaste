use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::LookupMap,
    env, near_bindgen,
    serde::{Deserialize, Serialize},
    AccountId, PanicOnDefault,
};

#[derive(BorshSerialize, BorshDeserialize, Debug, Serialize, Deserialize, Default)]
#[serde(crate = "near_sdk::serde")]
pub struct Paste {
    id: String,
    title: String,
    content: String,
    is_encrypted: bool,
    timestamp: u64,
}

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize, PanicOnDefault)]
pub struct Contract {
    pastes: LookupMap<String, Paste>,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            pastes: LookupMap::new(b"p"),
        }
    }

    pub fn signed(&mut self) -> Vec<AccountId> {
        env::log_str(&format!(
            "{:?}, {:?}, {:?}",
            env::current_account_id(),
            env::predecessor_account_id(),
            env::signer_account_id()
        ));

        if env::current_account_id() != env::predecessor_account_id()
            && env::current_account_id() != env::signer_account_id()
        {
            env::panic_str(&format!(
                "paste can only be created by account {}",
                env::current_account_id()
            ));
        }

        vec![
            env::current_account_id(),
            env::predecessor_account_id(),
            env::signer_account_id(),
        ]
    }

    pub fn new_paste(
        &mut self,
        id: String,
        title: String,
        content: String,
        is_encrypted: bool,
    ) -> bool {
        if env::current_account_id() != env::predecessor_account_id()
            && env::current_account_id() != env::signer_account_id()
        {
            env::panic_str(&format!(
                "paste can only be created by account {}",
                env::current_account_id()
            ));
        }

        if self.pastes.contains_key(&id) {
            env::panic_str(&format!("id {} already exists", id));
        }

        let paste = &Paste {
            id,
            content,
            title,
            is_encrypted,
            timestamp: env::block_timestamp(),
        };

        self.pastes.insert(&paste.id, paste);
        true
    }

    pub fn get_paste(&self, id: String) -> Option<Paste> {
        self.pastes.get(&id)
    }
}

#[cfg(test)]
mod tests {

    use near_sdk::{test_utils::VMContextBuilder, testing_env, AccountId};

    use super::*;

    fn get_context(predecessor: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(predecessor);
        builder
    }

    #[test]
    fn test_new_paste() {
        let account = AccountId::new_unchecked("alice.near".to_string());
        let context = get_context(account.clone());
        testing_env!(context.build());

        let mut contract = Contract::new();

        let id = "test".to_string();
        let title = "Untitled".to_string();
        let content = "Some amazing content".to_string();
        let is_encrypted = false;

        let result = &contract.new_paste(id.clone(), title, content, is_encrypted);
        assert!(result);

        let paste = contract.get_paste(id.clone()).unwrap();
        assert_eq!(paste.id, id);
    }

    #[test]
    fn paste_not_found() {
        let account = AccountId::new_unchecked("alice.near".to_string());
        let context = get_context(account.clone());
        testing_env!(context.build());

        let contract = Contract::new();
        let paste_not_found = contract.get_paste("another_paste".to_string()).is_none();
        assert!(paste_not_found);
    }

    #[test]
    #[should_panic]
    fn paste_exists() {
        let account = AccountId::new_unchecked("alice.near".to_string());
        let context = get_context(account.clone());
        testing_env!(context.build());

        let mut contract = Contract::new();

        let id = "test".to_string();
        let is_encrypted = false;

        contract.new_paste(id.clone(), String::new(), String::new(), is_encrypted);
        contract.new_paste(id.clone(), String::new(), String::new(), is_encrypted);
    }
}
